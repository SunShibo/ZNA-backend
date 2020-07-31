<template> <!--以修改-->
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 在招岗位
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="add" @click="add">新增</el-button>
            </div>
            <el-table
                    :data="data"
                    border
                    class="table"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange"
                    v-loading="$store.state.requestLoading"
            >
                <el-table-column label="发布时间" :formatter="dealTime" prop="createTime"></el-table-column>
                <el-table-column  :show-overflow-tooltip="true"  label="职位名称中文"  prop="jobTitle"></el-table-column>
                <el-table-column  :show-overflow-tooltip="true"  label="职位名称英文"  prop="jobTitleEnglish"></el-table-column>
                <el-table-column  :show-overflow-tooltip="true"  label="岗位职责中文"  prop="positionStatement"></el-table-column>
                <el-table-column  :show-overflow-tooltip="true"  label="岗位职责英文"  prop="positionStatementEnglish"></el-table-column>
                <el-table-column  :show-overflow-tooltip="true"  label="任职资格中文"  prop="qualification"></el-table-column>
                <el-table-column  :show-overflow-tooltip="true"  label="任职资格英文"  prop="qualificationEnglish"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
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

        <!-- 编辑弹出框 -->
        <el-dialog title="新增/编辑" :visible.sync="editVisible" width="70%" :close-on-click-modal="closeOnClickModal">
            <el-form ref="form" :model="form" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item required="" label="岗位名称中">
                            <el-input  v-model="form.jobTitle"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item required="" label="岗位名称英">
                            <el-input  v-model="form.jobTitleEnglish"></el-input>
                        </el-form-item>

                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item required="" label="岗位职责中">
                            <quill-editor ref="newEditor" v-model="form.positionStatement" :options="editorOption"></quill-editor>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item required="" label="岗位职责英">
                            <quill-editor ref="newEditor" v-model="form.positionStatementEnglish" :options="editorOption"></quill-editor>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item required="" label="任职资格中">
                            <quill-editor ref="newEditor" v-model="form.qualification" :options="editorOption"></quill-editor>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item required="" label="任职资格英">
                            <quill-editor ref="newEditor" v-model="form.qualificationEnglish" :options="editorOption"></quill-editor>
                        </el-form-item>
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
        name: 'dy_home',
        components: {UpLoad,quillEditor},
        data() {
            return {
                editorOption: {
                    placeholder: '开始编辑...',
                    modules:{
                        toolbar:[
                            ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                            [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
                            [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
                            [{ 'align': [] }],    //对齐方式
                            ['clean'],    //清除字体样式
                        ]
                    },
                    theme:'snow'
                },
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
                    jobTitle:'',
                    jobTitleEnglish:'',
                    positionStatement:'',
                    qualification:'',
                    positionStatementEnglish:'',
                    qualificationEnglish:''
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
                this.form.pictureUrl = res.data.picturePhone;
                this.form.pictureUrlPc=res.data.picturePC;
                console.log( this.form);
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
                this.$axios.post("/recruitingJob/getRecruitingJob", this.search)
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
                    jobTitle:'',
                    jobTitleEnglish:'',
                    positionStatement:'',
                    qualification:'',
                    positionStatementEnglish:'',
                    qualificationEnglish:''
                };
                this.pictureUrl = [];//缩略图
            },

            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.pictureUrl = [];//缩略图
                this.form = {
                    id: item.id,
                    jobTitle:item.jobTitle,
                    jobTitleEnglish:item.jobTitleEnglish,
                    qualification:item.qualification,
                    qualificationEnglish:item.qualificationEnglish,
                    positionStatement:item.positionStatement,
                    positionStatementEnglish:item.positionStatementEnglish,
                };

                if (!!item.pictureUrl) {
                    this.pictureUrl = [{name: item.pictureUrl, url: item.pictureUrl}];//缩略图
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.form = row;
                this.idx = index;
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            // 保存编辑
            saveEdit() {
                let fd = JSON.parse(JSON.stringify(this.form));
                delete fd.time;


                if (this.form.id == "") {
                    delete fd.id;
                    this.$axios.post("/recruitingJob/addRecruitingJob", fd).then(res => {
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
                    this.$axios.post("/recruitingJob/updRecruitingJob", fd).then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }
                        this.$message.success(`操作成功`);
                        this.getData();
                        this.editVisible = false;
                    });
                }
            },
            // 确定删除
            deleteRow() {
                this.$axios
                    .post("/recruitingJob/delRecruitingJob", {id: this.form.id})
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