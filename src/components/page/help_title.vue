<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 帮助中心
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="add" @click="add">新增</el-button>
            </div>
            <el-table
                    v-loading="$store.state.requestLoading"
                    :data="data"
                    border
                    class="table"
                    ref="multipleTable"

                    @selection-change="handleSelectionChange">
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="content" :show-overflow-tooltip="showOverflowTooltip"
                                 label="详情"></el-table-column>
                <el-table-column prop="serialNumber" label="排序"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                type="text"
                                @click="handleIntro(scope.$index, scope.row)"
                        >详情
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
                        </el-button>

                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 富文本弹出框 -->
        <el-dialog @open="init()" title="" :visible.sync="editVisibleFullText" :close-on-click-modal="closeOnClickModal"
                   width="70%">
            <div class="container">
                <UpLoad
                        v-show="false"
                        :onUpLoadSuccess="newEditorSuccess"
                        :onUpLoadError="onUpLoadError"
                        :multiple="false"
                        :showFileList="false"
                        :drag="false"
                        accept="image/*"
                        :fileList="videoImgList"
                        refUpLoad="uniqueId"
                        idName="uniqueId"
                        :filesNumber="999"
                        :isClear="true"
                        listType="picture"></UpLoad>
                <quill-editor ref="newEditor" v-model="content" :options="editorOption"></quill-editor>
                <el-button class="editor-btn" type="primary" @click="editVisibleFullText = false">取消</el-button>
                <el-button class="editor-btn" type="primary" :loading="$store.state.requestLoading"
                           @click="saveFullText">确 定
                </el-button>

            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="新增/编辑" :visible.sync="editVisible" width="70%" :close-on-click-modal="closeOnClickModal">
            <el-form ref="help" :rules="rules" :model="form" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                        <el-form-item label="排序" prop="serialNumber">
                            <el-input type="number" v-model="form.serialNumber"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" :loading="$store.state.requestLoading" @click="saveEdit">确 定</el-button>
      </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" :loading="$store.state.requestLoading" @click="deleteRow">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';
    import UpLoad from '../common/Upload.vue';
    export default {
        name: 'help_title',
        data() {
            return {
                showOverflowTooltip: true,
                editVisibleFullText: false,
                content: '',
                editorOption: {
                    placeholder: '开始编辑...'
                },
                search: {},
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                videoImgList: [],
                editVisible: false,
                delVisible: false,
                form: {
                    id: "",
                    title: "",
                    content: "",
                    serialNumber: 0,

                },
                content: '',    //语言简介
                languageLightspot: '',//语言亮度
                idx: -1,
                rules: {
                    title: [
                        {required: true, message: '标题不能为空', trigger: 'change,blur'}
                    ],
                    serialNumber: [
                        {required: true, message: '排序码不能为空', trigger: 'change,blur'}
                    ]
                }
            };
        },
        created() {
            this.getData();

        },
        components: {
            quillEditor,
            UpLoad
        },
        computed: {
            data() {
                return this.tableData;
            }
        },
        methods: {
            onUpLoadError(err){
                console.error(err);
                this.$message.success('上传失败，请重新上传！');
            },
            onEditorChange({editor, html, text}) {//change事件
                this.content = html;
            },

            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios
                    .post("/helpCenter/selectHelpCenter", this.search)
                    .then(res => {
                        this.tableData = res.data;
                    });
            },
            _search() {
                this.getData();
            },
            add() {
                //添加
                this.editVisible = true;
                this.form = {
                    id: "",
                    title: "",
                    content: "",
                    serialNumber: 0,

                };
            },
            handleIntro(index, row){
                this.idx = index;
                const item = this.tableData[index];
                this.form = item;
                this.content = item.content;
                this.flag = 0;
                this.editVisibleFullText = true;
            },
            saveFullText(){
                this.$axios.post("/helpCenter/updateHelpCenter", {
                    id: this.form.id,
                    content: this.content
                }).then(res => {
                    if (!res.success) {
                        this.$message.error(res.errMsg);
                        return;
                    }
                    this.$message.success(`成功`);
                    this.getData();
                    this.editVisibleFullText = false;
                });

            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.ensignImageUrl = [];//标识图片
                this.thumbnailImageUrl = [];//缩略图
                this.videoPath = [];//先导片
                this.form = {
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    serialNumber: item.serialNumber,
                };
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.form = row;
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //保存编辑
            saveEdit() {
                this.$refs.help.validate((valid) => {
                    if (valid) {
                        let fd = JSON.parse(JSON.stringify(this.form));
                        delete fd.time;
                        if (this.form.id == "") {
                            delete fd.id;
                            this.$axios.post("/helpCenter/insertHelpCenter", fd).then(res => {
                                if (!res.success) {
                                this.$message.error(res.errMsg);
                                return;
                            }
                            this.$message.success(`操作成功`);
                            this.getData();
                            this.editVisible = false;
                        });
                        } else {
                            //编辑
                            this.$axios.post("/helpCenter/updateHelpCenter", fd).then(res => {
                                if (!res.success) {
                                this.$message.success(res.errMsg);
                                return;
                            }
                            this.$message.success(`操作成功`);
                            this.getData();
                            this.editVisible = false;
                        });
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                     }
                });
            },
            formatDate(v){
                if (v != null) {
                    var date1 = new Date(v);
                    return date1.getFullYear() + '/' + (date1.getMonth() + 1) + '/' + date1.getDate();
                } else {
                    return '';
                }
            },
            // 确定删除
            deleteRow() {
                this.$axios
                    .post("/helpCenter/deleteHelpContent", {id: this.form.id})
                    .then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }
                        this.tableData.splice(this.idx, 1);
                        this.$message.success("删除成功");
                        this.delVisible = false;
                    });
            },
            //上传图片回调
            newEditorSuccess(response, file){
                this.addImgRange = this.$refs.newEditor.quill.getSelection();
                this.$refs.newEditor.quill.insertEmbed(this.addImgRange != null ? this.addImgRange.index : 0, 'image', response)
                // 调整光标到最后
                this.$refs.newEditor.quill.setSelection(this.addImgRange.index + 1);
            },
            init(){
                this.$nextTick(() => {
                    let imgHandler = async function (state) {//异步触发element ui的上传图片按钮
                        if (state) {
                            let fileInput = document.querySelector('#uniqueId input'); //隐藏的file元素
                            fileInput.click(); //触发事件
                        }
                    }
                    this.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler)//将点击事件绑定到工具栏上的图片上传按钮上
                })
            }

        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 100px;
        display: inline-block;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .el-row {
        margin-bottom: 20px;

    &
    :last-child {
        margin-bottom: 0;
    }

    }
    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple {
        background: #d3dce6;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>
