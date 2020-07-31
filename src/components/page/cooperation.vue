<template> <!--以修改-->
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 合作伙伴
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <el-button type="primary" icon="add" @click="add">新增</el-button>
            <el-table
                    :data="data"
                    border
                    class="table"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange"
                    v-loading="$store.state.requestLoading"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="ID" prop="id"></el-table-column>
                <el-table-column label="发布时间" :formatter="dealTime" prop="createTime"></el-table-column>
                <el-table-column label="排序" prop="sort"></el-table-column>
                <el-table-column label="图片" prop="pictureUrl">
                    <template slot-scope="scope">
                        <img :src="scope.row.pictureUrl" alt="" style="width: 50px;height: 50px">
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px" align="center">
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="70%" :close-on-click-modal="closeOnClickModal">
            <el-form ref="form" :model="form" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item required="" label="缩略图">
                            <el-upload
                                    class="upload-demo"
                                    action="/image/uploadImgPng"
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
                    <el-col>
                        <el-form-item label-width="100px" label="排序" prop="sort">
                            <el-input v-model="form.sort"></el-input>
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

    import UpLoad from '../common/Upload.vue';

    export default {
        name: 'dy_home',
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
                    pictureUrl: "",
                    pictureUrlPc: "",
                    sort: 0
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
                this.form.pictureUrlPc = res.data.picturePC;
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
            dealStatus(row) {
                return row.state == 'show' ? '上架' : '下架'
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios.post("/cooperativeClient/getCooperativeClient", this.search)
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
                    state: "show",
                    pictureUrl: "",
                    pictureUrlPc: "",
                    type: "",
                    skipUrl: "",
                    sort: 0,
                };
                this.pictureUrl = [];//缩略图
            },

            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.pictureUrl = [];//缩略图
                this.form = {
                    id: item.id,
                    pictureUrl: item.pictureUrl,
                    sort: item.sort,
                };

                if (!!item.pictureUrl) {
                    this.pictureUrl = [{name: item.pictureUrl, url: item.pictureUrl}];//缩略图
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                const item = this.tableData[index];
                this.form.id = item.id;
                this.delVisible = true;
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
                    this.$axios.post("/cooperativeClient/addCooperativeClient", fd).then(res => {
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
                    this.$axios.post("/cooperativeClient/updateCooperativeClient", fd).then(res => {
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
                    .post("/cooperativeClient/delCooperativeClient", {idArr: '[' + this.form.id + ']'})
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
            delAll() {
                const length = this.multipleSelection.length;
                if (length == 0) return;
                if (!confirm(`您确定要删除 ${length} 条数据吗？`)) return;
                let str = [];
                // this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str.push(this.multipleSelection[i]["id"]);
                }
                this.$axios
                    .post("/cooperativeClient/delCooperativeClient", {idArr: '[' + str.join(",") + ']'})
                    .then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }

                        this.$message.success("删除成功");
                        this.delVisible = false;
                        this.getData();
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