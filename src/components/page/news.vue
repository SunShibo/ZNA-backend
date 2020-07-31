<template> <!--以修改-->
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 发布动态
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="s_title" placeholder="标题" class="handle-input mr10" ></el-input>
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
                <el-table-column label="时间"  prop="time"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="标题中文"  prop="title"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="标题英文"  prop="titleEnglish"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="内容中文"  prop="context"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="内容英文"  prop="contextEnglish"></el-table-column>
                <el-table-column prop="sort" label="排序"></el-table-column>
                <el-table-column label="图片" prop="pictureUrl" width="80">
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
                        <el-button
                                type="text"
                                @click="handleContext(scope.$index, scope.row)"
                        >编辑内容
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
                        <el-form-item required="" label="中文标题">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="英文标题">
                            <el-input v-model="form.titleEnglish"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="时间">
                            <el-input v-model="form.time"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="排序">
                            <el-input type="number" v-model="form.sort"></el-input>
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

        <!--富文本编辑-->
        <el-dialog     title="内容编辑"  :visible.sync="context " width="70%" :close-on-click-modal="closeOnClickModal">
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
                        <quill-editor ref="newEditor" v-model="content" :options="editorOption"></quill-editor>
                    </el-col>
                    <el-col :span="12">
                        <quill-editor ref="newEditor" v-model="contentE" :options="editorOption"></quill-editor>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="editor-btn" type="primary"  @click="context = false">取消</el-button>
                <el-button class="editor-btn" type="primary" :loading="$store.state.requestLoading" @click="contextSave()">确 定</el-button>
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
        name: 'news',
        components: {UpLoad, quillEditor},
        data() {
            return {
                editVisibleFullText: false,
                pictureUrl: [],//图
                // 默认显示第几页
                currentPage:1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount:0,
                // 个数选择器（可修改）
                pageSizes:[10,20,50,100],
                // 默认每页显示的条数（可修改）
                PageSize:10,
                s_title:'',
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
                content:'',
                contentE:'',
                tableData: [],
                multipleSelection: [],
                editVisible: false,
                delVisible: false,
                context:false,
                form: {
                    id: "",
                    title:"",
                    titleEnglish:"",
                    sort:0,
                    context:"",
                    contextEnglish:"",
                    pictureUrl: "",
                    pictureUrlPc: "",
                    time:""
                },
                idx: -1
            }
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
            },
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
                this.$axios.post("/recentNews/selectRecentNews",{
                    pageNo:this.currentPage,
                    pageSize:this.PageSize,
                    title:this.s_title,
                }, this.search)
                    .then(res => {
                        this.tableData = res.data.recentNewsBOS;
                        this.totalCount = res.data.count;
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
                    title:"",
                    titleEnglish:"",
                    sort:0,
                    context:"",
                    contextEnglish:"",
                    pictureUrl: "",
                    pictureUrlPc: "",
                    time:''
                };
                this.pictureUrl = [];//缩略图
            },
            handleContext(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form=row;
                this.content=item.context;
                this.contentE=item.contextEnglish
                this.form.id=item.id;
                this.context=true;
            },

            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.pictureUrl = [];//缩略图
                this.form = {
                    id: item.id,
                    title:item.title,
                    titleEnglish:item.titleEnglish,
                    time:item.time,
                    sort:item.sort,
                    context:item.context,
                    contextEnglish:item.contextEnglish,
                    pictureUrl: item.pictureUrl,
                    pictureUrlPc:item.pictureUrlPc,
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
            contextSave(){
                this.form.context=this.content;
                this.form.contextEnglish=this.contentE;
                let fd = JSON.parse(JSON.stringify(this.form));
                delete fd.sort;
                this.$axios.post("/recentNews/updateRecentNews", fd).then(res => {
                    if (!res.success) {
                        this.$message.success(res.errMsg);
                        return;
                    }
                    this.$message.success(`操作成功`);
                    this.getData();
                    this.editVisible = false;
                });
                this.context=false;
            },
            // 保存编辑
            saveEdit() {
                let fd = JSON.parse(JSON.stringify(this.form));
               if (!fd.pictureUrl) {
                    this.$message.error("图片必须上传");
                    return false;
                }

                if (this.form.id == "") {
                    delete fd.id;
                    this.$axios.post("/recentNews/addRecentNews", fd).then(res => {
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
                    this.$axios.post("/recentNews/updateRecentNews", fd).then(res => {
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
                    .post("/recentNews/delRecentNews", {id: this.form.id})
                    .then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }
                        this.tableData.splice(this.idx, 1);
                        this.$message.success("删除成功");
                        this.delVisible = false;
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