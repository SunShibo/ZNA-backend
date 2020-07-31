<template> <!--以修改-->
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 公司介绍
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table
                    :data="data"
                    border
                    class="table"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column label="中文内容"   :show-overflow-tooltip="true"  prop="context"></el-table-column>
                <el-table-column label="英文内容"   :show-overflow-tooltip="true"  prop="contextEnglish"></el-table-column>
                <el-table-column label="图片" prop="pictureUrl"  width="110px" >
                    <template slot-scope="scope">
                        <img :src="scope.row.pictureUrl" alt="" style="width: 50px;height: 50px">
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑图片
                        </el-button>
                        <el-button
                                type="text"
                                @click="handleContext(scope.$index, scope.row)"
                        >编辑内容
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="新增/编辑" :visible.sync="editVisible" width="70%" :close-on-click-modal="closeOnClickModal">
            <el-form ref="form" :model="form" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item required="" label="缩略图">
                            <el-upload
                                    class="upload-demo"
                                    action="/image/uploadImg"
                                    :on-success="pictureUrlSuccess"
                                    :on-remove="handleRemoveThumbnailImageUrl"
                                    :on-error="onUpLoadError"
                                    :multiple="false"
                                    :drag="true"
                                    accept="image/*"
                                    :fileList="pictureUrl"
                                    list-type="picture">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" :loading="$store.state.requestLoading" @click="saveEdit">确 定</el-button>
               </span>
        </el-dialog>


        <!--富文本编辑-->
        <el-dialog     title="内容编辑"  :visible.sync="bcontxt " width="70%" :close-on-click-modal="closeOnClickModal">
            <el-form ref="form" :model="form" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        中文:
                    </el-col>
                    <el-col :span="12">
                        英文:
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <quill-editor ref="newEditor" v-model="form.context" :options="editorOption"></quill-editor>
                    </el-col>
                    <el-col :span="12">
                        <quill-editor ref="newEditor" v-model="form.contextEnglish" :options="editorOption"></quill-editor>
                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button class="editor-btn" type="primary"  @click="bcontxt = false">取消</el-button>
                <el-button class="editor-btn" type="primary" :loading="$store.state.requestLoading" @click="saveContext()">确 定</el-button>
             </span>
        </el-dialog>




    </div>
</template>

<script>

    import UpLoad from '../common/Upload.vue';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';
    export default {
        name: 'dy_model',
        components: {UpLoad,quillEditor},
        data() {
            return {
                editorOption: {
                    placeholder: '开始编辑...',
                    modules:{
                        toolbar:[
                            ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                            ['blockquote', 'code-block'],     //引用，代码块
                            [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
                            [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
                            [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
                            [{ 'direction': 'rtl' }],             // 文本方向
                            [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
                            [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
                            [{ 'font': [] }],     //字体
                            [{ 'align': [] }],    //对齐方式
                            ['clean'],    //清除字体样式
                            //  ['image','video']    //上传图片、上传视频
                        ]
                    },
                    theme:'snow'
                },
                bcontxt:false,
                editVisibleFullText: false,
                pictureUrl: [],//图
                search: {
                    state: ''
                },
                tableData: [],
                multipleSelection: [],
                editVisible: false,
                delVisible: false,
                form: {
                    id: "",
                    pictureUrl: "",
                    pictureUrlPc: "",
                    context: "",
                    contextEnglish: ""
                },
                idx: -1
            };
        },
        created() {
            this.getData();

        },
        computed: {
            data() {
                return this.tableData;
            }
        },
        methods: {
            onUpLoadError(err) {
                console.error(err);
                this.$message.success('上传失败，请重新上传！');
            },
            pictureUrlSuccess(res, file) {
                this.form.pictureUrl =res.data.picturePhone;
                this.form.pictureUrlPc=res.data.picturePC;
            },
            handleRemoveThumbnailImageUrl(file, fileList) {

            },
            dealTime(row) {
                if (row.createTime != null) {
                    var date1 = new Date(row.createTime.time);
                    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate();
                } else {
                    return '';
                }
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios.post("/aboutUs/selectAboutUs", this.search)
                    .then(res => {
                        this.tableData=[];
                        this.tableData.push(res.data);
                    });
            },
            _search() {
                this.getData();
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.pictureUrl = [];//缩略图
                this.form = {
                    id: item.id,
                    pictureUrl: item.pictureUrl,
                };

                if (!!item.pictureUrl) {
                    this.pictureUrl = [{name: item.pictureUrl, url: item.pictureUrl}];//缩略图
                }
                this.editVisible = true;
            },
            handleContext(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id: item.id,
                    contextEnglish:item.contextEnglish,
                    context:item.context
                };

               this.bcontxt=true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            // 保存编辑
            saveEdit() {
                let fd = JSON.parse(JSON.stringify(this.form));
                delete fd.time;

               if (!fd.pictureUrl) {
                    this.$message.error("图片必须上传");
                    return false;
                }

                //编辑
                this.$axios.post("/aboutUs/updateAboutUs", fd).then(res => {
                    if (!res.success) {
                        this.$message.success(res.errMsg);
                        return;
                    }
                    this.$message.success(`操作成功`);
                    this.getData();
                    this.editVisible = false;
                });
            },
            saveContext() {
                let fd = JSON.parse(JSON.stringify(this.form));
                delete fd.pictureUrl;
                delete fd.pictureUrlPc;

                //编辑
                this.$axios.post("/aboutUs/updateAboutUs", fd).then(res => {
                    if (!res.success) {
                        this.$message.success(res.errMsg);
                        return;
                    }
                    this.$message.success(`操作成功`);
                    this.getData();
                    this.bcontxt = false;
                });
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