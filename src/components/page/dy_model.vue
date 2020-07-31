<template> <!--以修改-->
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 首页模块配置
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
                <el-table-column :show-overflow-tooltip="true" label="中文标题"  prop="title"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="英文标题"  prop="titleEnglish"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="中文内容"  prop="context"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="英文内容"  prop="contextEnglish"></el-table-column>
                <el-table-column  label="图片" prop="pictureUrl" width="80">
                    <template slot-scope="scope">
                        <img :src="scope.row.pictureUrl" alt="" style="width: 50px;height: 50px">
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
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
                        <el-form-item required="" label="中文标题">
                            <el-input  v-model="form.title"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="英文标题">
                            <el-input  v-model="form.titleEnglish"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="中文内容">
                            <el-input type="textarea"  :rows="5" v-model="form.context"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="英文内容">
                            <el-input type="textarea" :rows="5"  v-model="form.contextEnglish"></el-input>
                        </el-form-item>
                    </el-col>
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


    </div>
</template>

<script>

    import UpLoad from '../common/Upload.vue';

    export default {
        name: 'dy_model',
        components: {UpLoad},
        data() {
            return {
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
                    title: "",
                    titleEnglish: "",
                    context:"",
                    contextEnglish:"",
                    pictureUrl: "",
                    pictureUrlPc: "",
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
                this.$axios.post("/index/selectIndex", this.search)
                    .then(res => {
                        this.tableData = res.data;
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
                    title: item.title,
                    titleEnglish: item.titleEnglish,
                    context	: item.context	,
                    contextEnglish: item.contextEnglish,
                    pictureUrl: item.pictureUrl,
                    pictureUrlPc: item.pictureUrlPc
                };

                if (!!item.pictureUrl) {
                    this.pictureUrl = [{name: item.pictureUrl, url: item.pictureUrl}];//缩略图
                }
                this.editVisible = true;
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

                if (this.form.id == "") {
                    delete fd.id;
                    this.$axios.post("/banner/addBanner", fd).then(res => {
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
                    this.$axios.post("/index/updateIndex", fd).then(res => {
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