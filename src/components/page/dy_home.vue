<template> <!--以修改-->
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 首页Banner管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                上/下架状态：
                <el-select v-model="search.state" placeholder="上/下架状态" style="margin-right:10px;width:100px;">
                    <el-option
                            v-for="item in statusOption"
                            :key="item.key"
                            :label="item.key"
                            :value="item.value"
                    ></el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="_search">搜索</el-button>
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
                <el-table-column label="ID" prop="id"></el-table-column>
                <el-table-column label="发布时间" :formatter="dealTime" prop="createTime"></el-table-column>
                <el-table-column label="发布状态" :formatter="dealStatus" prop="state"></el-table-column>
                <el-table-column label="跳转项目" prop="skipTitle"></el-table-column>
                <el-table-column label="图片" prop="url" width="100">
                    <template slot-scope="scope">
                        <img :src="scope.row.pictureUrl" alt="" style="width: 50px;height: 50px">
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序"></el-table-column>
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
                        <el-form-item required="" label="排序">
                            <el-input type="number" v-model="form.sort"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="跳转项目">
                            <el-cascader
                                    :options="options"
                                    v-model="defOption"
                                    :show-all-levels="false"
                                    @change="change"
                            ></el-cascader>
                        </el-form-item>
                        <el-form-item required="" label="上架状态">
                            <el-select v-model="form.state">
                                <el-option
                                        v-for="item in state"
                                        :key="item.key"
                                        :label="item.key"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
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
                options: [],
                defOption: [],
                editVisibleFullText: false,
                pictureUrl: [],//图
                search: {
                    state: ''
                },
                statusOption: [{key: '不限', value: ''}, {key: '上架', value: 'show'}, {key: '下架', value: 'notShow'}],
                state: [{key: '上架', value: 'show'}, {key: '下架', value: 'notShow'}],
                tableData: [],
                multipleSelection: [],
                editVisible: false,
                delVisible: false,
                form: {
                    id: "",
                    title: "",
                    state: "show",
                    pictureUrl: "",
                    pictureUrlPc: "",
                    sort: 0,
                    skipId: 0,
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
                /*
                 * 使用axios中的all 进行并行请求
                 * 防止处理数据时加载顺序不正确导致报错的问题
                 */
                this.$axios.all([
                    this.$axios.post("/banner/selectBanner", this.search),
                    this.$axios.post("/projectType/getTypeProject")

                ]).then(this.$axios.spread((tableData, options) => {
                    // 上面两个请求都完成后，才执行这个回调方法

                    this.tableData = tableData.data;
                    this.options = options.data.map(item => {
                        if (!item) return null;

                        item.value = Number(item.value);
                        return item;
                    }).filter(item => item);

                }));
            },
            _search() {
                this.getData();
            },
            add() {
                //添加
                this.defOption = [];
                this.editVisible = true;
                this.form = {
                    id: "",
                    title: "",
                    state: "show",
                    pictureUrl: "",
                    pictureUrlPc: "",
                    skipTitle: '',
                    type: "",
                    skipUrl: "",
                    skipId: 0,
                    sort: 0,
                };
                this.pictureUrl = [];//缩略图
            },
            change(res) {
                this.form.skipId = res[1];
            },
            handleEdit(index, row) {
                // debugger
                this.idx = index;
                const item = this.tableData[index];
                this.pictureUrl = [];//缩略图
                if (!!item.skipTitle) {
                    this.defOption = this.checkChildrenArray(this.options, item.skipId);
                }
                this.form = {
                    id: item.id,
                    title: item.title,
                    state: item.state,
                    pictureUrl: item.pictureUrl,
                    type: item.type,
                    skipUrl: item.skipUrl,
                    sort: item.sort,
                    skipId: item.skipId
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
                    this.$axios.post("/banner/updateBanner", fd).then(res => {
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
                    .post("/banner/removeBanner", {id: this.form.id})
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

            /**
             * 按条件获取数组内的value 并将数组拍平
             * @param arr
             * @param checkId
             * @returns {Array}
             */
            checkChildrenArray(arr, checkId) {
                let itemArr = [];
                arr.forEach(item => {
                    if (item === null) return [];

                    //判断子元素是否有相同的id
                    item.children.forEach(childrenItem => {
                        if (childrenItem.value === checkId) {
                            itemArr.push(item.value);
                            itemArr.push(childrenItem.value);
                        }
                    });
                });
                return itemArr;
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