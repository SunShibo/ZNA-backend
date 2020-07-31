<template> <!--以修改-->
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 关于我们历史图片
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="add" @click="add">新增</el-button>
            </div>

            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    v-loading="$store.state.requestLoading"
            >
                <el-table-column
                        prop="time"
                        label="日期"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="图片"
                        align="center" >
                    <template slot-scope="scope">
                        <img :src="scope.row.pictureUrl" alt="" style="width: 200px;height: 100px">
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 prop="context"
                        align="center"
                        label="中文文本">
                </el-table-column>
                <el-table-column  :show-overflow-tooltip="true"
                                  prop="contextEnglish"
                        align="center"
                        label="英文文本">
                </el-table-column>
                <el-table-column
                        prop="sort"
                        align="center"
                        label="排序">
                </el-table-column>

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
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizes"
                        :page-size="PageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
                </el-pagination>
            </div>
        </div>

            <!-- 编辑弹出框 -->
            <el-dialog title="新增/编辑" :visible.sync="editVisible" width="70%" :close-on-click-modal="closeOnClickModal">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item required="" label="日期">
                                <el-input  v-model="form.time"></el-input>
                            </el-form-item>
                            <el-form-item required="" label="排序">
                                <el-input type="number" v-model="form.sort"></el-input>
                            </el-form-item>
                            <el-form-item  required="" label="中文内容">
                                <quill-editor ref="newEditor" v-model="form.context" :options="editorOption"></quill-editor>
<!--                                <el-input  type="textarea" :rows="6" v-model="form.context"></el-input>-->
                            </el-form-item>
                            <el-form-item required="" label="英文内容">
                                <quill-editor ref="newEditor" v-model="form.contextEnglish" :options="editorOption"></quill-editor>
<!--                                <el-input  type="textarea" :rows="6"  v-model="form.contextEnglish"></el-input>-->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item required="" label="缩略图">
                                <el-upload
                                        class="upload-demo"
                                        action="/image/uploadImg"
                                        :on-success="pictureUrlSuccess"
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
    <el-dialog title="提示" :visible.sync="delVisible" width="350px" center>
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
    export default {
        name: 'dy_model',
        components: {quillEditor},
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

                // 默认显示第几页
                currentPage:1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount:0,
                // 个数选择器（可修改）
                pageSizes:[10,20,50,100],
                // 默认每页显示的条数（可修改）
                PageSize:10,
                tableData: [],
                editVisible: false,
                pictureUrl:[],
                delVisible:false,
                idx:-1,
                form: {
                    id: "",
                    context: "",
                    contextEnglish: "",
                    pictureUrl: "",
                    pictureUrlPc: "",
                    time: "",
                    sort: 0,
                },
            };
        },
        created() {
            this.getData();
        },
        computed: {},
        methods: {
            getData() {
                this.$axios({
                    url: '/history/getHistory',
                    method: 'POST',
                    data: {
                        pageNo:this.currentPage,
                        pageSize:this.PageSize,
                    }
                }).then(res => {
                    this.tableData = res.data.historyBOS;
                    this.totalCount=res.data.count;
                });
            },
            handleEdit(index, row) {
                if (!!row.pictureUrl) {
                    this.pictureUrl = [{name: row.pictureUrl, url: row.pictureUrl}];//缩略图
                }
                this.form = {
                        id: row.id,
                        context: row.context,
                        contextEnglish: row.contextEnglish,
                        pictureUrl: row.pictureUrl,
                        pictureUrlPc:row.pictureUrlPc,
                        time: row.time,
                        sort: row.sort,
                }
                this.editVisible=true;
            },
            // 保存编辑
            saveEdit() {
                let fd = JSON.parse(JSON.stringify(this.form));
                if (!fd.pictureUrlPc) {
                    this.$message.error("图片必须上传");
                    return false;
                }
                if (this.form.id == "") {
                    delete fd.id;
                    this.$axios.post("/history/addHistory", fd).then(res => {
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
                    this.$axios.post("/history/updateHistory", fd).then(res => {
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
                    .post("/history/delHistory", {id: this.form.id})
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
            pictureUrlSuccess(res, file) {
                this.form.pictureUrl = res.data.picturePhone;
                this.form.pictureUrlPc=res.data.picturePC;
            },
            add() {
                this.pictureUrl=[];
                this.editVisible = true;
                this.form = {
                    id: "",
                    context: "",
                    contextEnglish: "",
                    pictureUrl: "",
                    pictureUrlPc: "",
                    time: "",
                    sort: "",
                }
            },
            handleDelete(index, row) {
                this.form.id = row.id;
                this.idx = index;
                this.delVisible = true;
            },
            // 每页显示的条数
            handleSizeChange(val) {

                // 改变每页显示的条数
                this.PageSize=val
                // 点击每页显示的条数时，显示第一页
                this.getData(val,1)
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
                this.currentPage=1
            },
            // 显示第几页
            handleCurrentChange(val) {

                // 改变默认的页数
                this.currentPage=val
                // 切换页码时，要获取每页显示的条数
                this.getData(this.PageSize,(val)*(this.pageSize))
            }
        }
    }
</script>

<style scoped>
    .handle-box{
        margin-bottom: 20px;
    }

    .red {
        color: #ff0000;
    }
</style>