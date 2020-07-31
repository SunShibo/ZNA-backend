<template>
    <!--已修改-->
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 项目配置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="s_title" placeholder="项目名称" class="handle-input mr10"></el-input>
                <el-select v-model="projectTypeName" placeholder="请选择分类" style="margin-right:10px;">
                    <el-option value="">全部</el-option>
                    <el-option
                            v-for="item in projectType"
                            :key="item.key"
                            :label="item.key"
                            :value="item.key"
                    ></el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
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
                <el-table-column :show-overflow-tooltip="true" prop="title" label="项目名中文" width="250"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="titleEnglish" label="项目名英文"
                                 width="250"></el-table-column>
                <el-table-column prop="sort" label="排序"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="context" label="内容中文"
                                 width="300"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="contextEnglish" label="内容英文"
                                 width="300"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="projectTypeName" label="项目类型"
                                 width="140"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="site" label="地点中文" width="150"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="siteEnglish" label="地点英文"
                                 width="150"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="floorSpace" label="场地面积中"
                                 width="120"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="floorSpaceEnglish" label="场地面积英"
                                 width="120"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="coveredArea" label="建筑面积中"
                                 width="120"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="coveredAreaEnglish" label="建筑面积英"
                                 width="120"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="client" label="业主中文" width="150"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="clientEnglish" label="业主英文"
                                 width="150"></el-table-column>
                <el-table-column label="操作" width="240" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="showImgae(scope.$index, scope.row)"
                        >查看图片
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
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
        <el-dialog title="新增/编辑" :visible.sync="editVisible" width="65%" :close-on-click-modal="closeOnClickModal">
            <el-form ref="userform" :model="form" label-width="50px">
                <el-row :gutter="20">

                    <el-col :span="12">
                        <el-form-item label-width="100px" label="项目名中文" prop="name">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                        <el-form-item label-width="100px" label="地点中文" prop="name">
                            <el-input v-model="form.site"></el-input>
                        </el-form-item>
                        <el-form-item label-width="100px" label="场地面积中" prop="name">
                            <el-input v-model="form.floorSpace"></el-input>
                        </el-form-item>
                        <el-form-item label-width="100px" label="建筑面积中" prop="name">
                            <el-input v-model="form.coveredArea"></el-input>
                        </el-form-item>
                        <el-form-item label-width="100px" label="客户名称中" prop="name">
                            <el-input v-model="form.client"></el-input>
                        </el-form-item>
                        <el-form-item label-width="90px" required="" label="排序编码">
                            <el-input type="number" v-model="form.sort"></el-input>
                        </el-form-item>
                        <el-form-item label-width="85px" :rules="[{required: true}]" label="上传图片">
                            <el-button type="primary" @click="upImgFile()" round>上传图片</el-button>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label-width="100px" label="项目名英文" prop="name">
                            <el-input v-model="form.titleEnglish"></el-input>
                        </el-form-item>
                        <el-form-item label-width="100px" label="地点英文" prop="name">
                            <el-input v-model="form.siteEnglish"></el-input>
                        </el-form-item>
                        <el-form-item label-width="100px" label="场地面积英" prop="name">
                            <el-input v-model="form.floorSpaceEnglish"></el-input>
                        </el-form-item>
                        <el-form-item label-width="100px" label="建筑面积英" prop="name">
                            <el-input v-model="form.coveredAreaEnglish"></el-input>
                        </el-form-item>
                        <el-form-item label-width="100px" label="客户名称英" prop="name">
                            <el-input v-model="form.clientEnglish"></el-input>
                        </el-form-item>
                        <el-form-item label-width="85px" label="项目类型" prop="kid">
                            <el-select v-model="form.type" filterable style="margin-right:10px;" @change="TypeChange">
                                <el-option
                                        v-for="item in projectType"
                                        :key="item.key"
                                        :label="item.key"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label-width="100px" label="项目详情参数中文内容" prop="name">
                            <!--                            <el-input type="textarea" :rows="13" v-model="form.context"></el-input>-->
                            <quill-editor ref="newEditor" v-model="form.property"
                                          :options="editorOption"></quill-editor>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="100px" label="项目详情参数英文内容" prop="name">
                            <!--                            <el-input type="textarea" :rows="13" v-model="form.contextEnglish"></el-input>-->
                            <quill-editor ref="newEditor" v-model="form.propertyEnglish"
                                          :options="editorOption"></quill-editor>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label-width="100px" label="项目中文内容" prop="name">
                            <!--                            <el-input type="textarea" :rows="13" v-model="form.context"></el-input>-->
                            <quill-editor ref="newEditor" v-model="form.context" :options="editorOption"></quill-editor>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="100px" label="项目英文内容" prop="name">
                            <!--                            <el-input type="textarea" :rows="13" v-model="form.contextEnglish"></el-input>-->
                            <quill-editor ref="newEditor" v-model="form.contextEnglish"
                                          :options="editorOption"></quill-editor>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" :loading="$store.state.requestLoading" @click="saveEdit('form')">确 定</el-button>
      </span>
        </el-dialog>

        <!-- 上传图片 -->
        <el-dialog title="上传图片" :visible.sync="upImg" width="70%" :close-on-click-modal="closeOnClickModal">
            <el-form ref="form" :model="form" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item required="" label="项目图片">
                            <el-upload
                                    class="upload-demo"
                                    action="/image/uploadImg"
                                    :on-success="handlePreview"
                                    :on-remove="handleRemove1"
                                    :file-list="fileList1"
                                    list-type="picture">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item required="" label="缩略图">
                            <el-upload
                                    :limit="1"
                                    class="upload-demo"
                                    action="/image/uploadImg"
                                    :on-success="handleThumbnailPreview"
                                    :on-remove="handleRemove1"
                                    :file-list="fileListThumbnail"
                                    list-type="picture">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="upImgFileColse()">取 消</el-button>
        <el-button type="primary" :loading="$store.state.requestLoading" @click="upImgFileYes()">确 定</el-button>
      </span>
        </el-dialog>

        <!-- 查看图片 -->
        <el-dialog title="查看图片" :visible.sync="showImage1" width="50%" :close-on-click-modal="closeOnClickModal">
            <div v-for="i in showimg" style="display: inline-block;margin: 10px;">
                <img :src="i" alt="" style="width: 150px;height: 100px">
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="showImage1 = false">取 消</el-button>
      </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import menu from '../common/menu'
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';

    export default {
        name: 'dy_project',
        components: {quillEditor},
        data() {
            return {
                editorOption: {
                    placeholder: '开始编辑...',
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                            [{'size': ['small', false, 'large', 'huge']}], // 字体大小
                            [{'header': [1, 2, 3, 4, 5, 6, false]}],     //几级标题
                            [{'color': []}, {'background': []}],     // 字体颜色，字体背景颜色
                            [{'align': []}],    //对齐方式
                            ['clean'],    //清除字体样式
                        ]
                    },
                    theme: 'snow'
                },
                // 总数据
                tableData: [],
                // 默认显示第几页
                currentPage: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount: 0,
                // 个数选择器（可修改）
                pageSizes: [10, 20, 50, 100],
                // 默认每页显示的条数（可修改）
                PageSize: 10,
                s_title: '',
                projectTypeName: '',
                projectType: [{key: "酒店/度假", value: "HOTEL/RESORT"},
                    {key: "办公/综合体", value: "OFFICE/MIXED-USE"},
                    {key: "文化/会展", value: "CIVIC/EXHIBITION"},
                    {key: "居住/养老", value: "RESIDENTIAL/HEALTHCARE"},
                    {key: "教育/科研", value: "EDUCATION/SCIENCE"},
                    {key: "城市规划", value: "MASTER/PLANNING"},
                    {key: "景观设计", value: "LANDSCAPE/DESIGN"},
                    {key: "室内设计", value: "INTERIOR/DESIGN"}
                ],
                show: true,
                genders: [{key: "male", v: "男"}, {key: "female", v: "女"}],
                options: [],
                tableData: [],
                fileList1: [],
                fileListThumbnail: [],
                fileListPhone: [],
                fileListPhone1: [],
                fileList: [],
                is_search: false,
                editVisible: false,
                upImg: false,
                passwordVisible: false,
                delVisible: false,
                showImage1: false,
                showimg: [],
                form: {
                    id: "",
                    projectTypeName: '',
                    projectTypeNameEnglish: '',
                    title: '',
                    titleEnglish: '',
                    sort: 0,
                    pictureUrl: '',
                    pictureUrlPc: '',
                    site: "",
                    siteEnglish: "",
                    context: "",
                    contextEnglish: "",
                    type: '',
                    floorSpace: '', //场地面积
                    floorSpaceEnglish: '',
                    coveredArea: '',//建筑面积
                    coveredAreaEnglish: '',
                    client: '',//业主
                    clientEnglish: '',
                    thumbnail: '',
                    property: '',
                    propertyEnglish: ''
                },
                idx: -1,
                menu: menu,
                defaultProps: {
                    children: "children",
                    label: "label"
                },
                count: 0,

            };
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData;
            },
            total() {
                return this.count;
            }
        },
        methods: {
            // 每页显示的条数
            handleSizeChange(val) {

                // 改变每页显示的条数
                this.PageSize = val
                // 点击每页显示的条数时，显示第一页
                this.getData(val, 1)
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
                this.currentPage = 1
            },
            // 显示第几页
            handleCurrentChange(val) {

                // 改变默认的页数
                this.currentPage = val
                // 切换页码时，要获取每页显示的条数
                this.getData(this.PageSize, (val) * (this.pageSize))
            },

            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                this.$axios.post("/project/getProject", {
                    pageNo: this.currentPage,
                    pageSize: this.PageSize,
                    title: this.s_title,
                    projectTypeName: this.projectTypeName,
                }).then(res => {
                    this.tableData = res.data.projectBOS;
                    this.totalCount = res.data.count;
                });
            },
            search() {
                this.getData();
            },
            add() {
                //添加
                this.fileList = [];
                this.fileListThumbnail = [];
                this.fileListPhone = [];
                this.fileListPhone1 = [];
                this.fileList1 = [];
                this.editVisible = true;
                this.form = {
                    id: "",
                    projectTypeName: '',
                    projectTypeNameEnglish: '',
                    title: '',
                    titleEnglish: '',
                    sort: 0,
                    pictureUrl: '',
                    pictureUrlPc: '',
                    site: "",
                    siteEnglish: "",
                    context: "",
                    contextEnglish: "",
                    type: '',
                    floorSpace: '', //场地面积
                    floorSpaceEnglish: '',
                    coveredArea: '',//建筑面积
                    coveredAreaEnglish: '',
                    client: '',//业主
                    clientEnglish: '',
                    thumbnail: ''
                };
                setTimeout(() => {
                    this.$refs['userform'].resetFields();
                }, 200);
                this.show = true;
            },
            showImgae(index, row) {
                this.showImage1 = true;
                this.idx = index;
                const item = this.tableData[index];
                this.showimg = JSON.parse(item.pictureUrlPc);
            },
            upImgFile() {
                this.upImg = true;
            },
            upImgFileColse() {
                this.upImg = false;
            },
            upImgFileYes() {
                this.form.pictureUrlPc = JSON.stringify(this.fileList);
                this.form.pictureUrl = JSON.stringify(this.fileListPhone);
                this.upImg = false;
            },
            handleRemove1(file, fileList) {
                console.log(file);
                if (this.fileListPhone != null) {
                    for (let i = 0; i < this.fileListPhone.length; i++) {
                        if (file.name == this.fileListPhone[i] || file.name == this.fileListPhone1[i] ) {
                            this.fileListPhone.splice(i, 1);
                            this.fileListPhone1.splice(i, 1);
                        }
                    }
                }
            }, handleThumbnailRemove1(file, fileList) {
                console.log(file);
                this.fileListThumbnail = [];
            }, handlePreview(file) {
                this.fileListPhone.push(file.data.picturePC);
                this.fileListPhone1.push(file.data.picturePhone);
            }
            , handleThumbnailPreview(file) {
                this.form.thumbnail = file.data.picturePC;
            },
            TypeChange(res) {
                if (res == 'HOTEL/RESORT') {
                    this.form.projectTypeName = '酒店/度假';
                    this.form.projectTypeNameEnglish = 'HOTEL / RESORT';
                } else if (res == 'OFFICE/MIXED-USE') {
                    this.form.projectTypeName = '办公/综合体';
                    this.form.projectTypeNameEnglish = 'OFFICE / MIXED-USE';
                } else if (res == 'EDUCATION/SCIENCE') {
                    this.form.projectTypeName = '教育/科研';
                    this.form.projectTypeNameEnglish = 'EDUCATION / SCIENCE';
                } else if (res == 'RESIDENTIAL/HEALTHCARE') {
                    this.form.projectTypeName = '居住/养老';
                    this.form.projectTypeNameEnglish = 'RESIDENTIAL / HEALTHCARE';
                } else if (res == 'MASTER/PLANNING') {
                    this.form.projectTypeName = '城市规划';
                    this.form.projectTypeNameEnglish = 'MASTER / PLANNING';
                } else if (res == 'LANDSCAPE/DESIGN') {
                    this.form.projectTypeName = '景观设计';
                    this.form.projectTypeNameEnglish = 'LANDSCAPE DESIGN';
                } else if (res == 'INTERIOR/DESIGN') {
                    this.form.projectTypeName = '室内设计';
                    this.form.projectTypeNameEnglish = 'INTERIOR DESIGN';
                } else if (res == 'CIVIC/EXHIBITION') {
                    this.form.projectTypeName = '文化/会展';
                    this.form.projectTypeNameEnglish = 'CIVIC / EXHIBITION';
                }
            },
            handleEdit(index, row) {
                this.show = false;
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id: item.id,
                    projectTypeName: item.projectTypeName,
                    projectTypeNameEnglish: item.projectTypeNameEnglish,
                    title: item.title,
                    titleEnglish: item.titleEnglish,
                    sort: item.sort,
                    pictureUrl: item.pictureUrl,
                    pictureUrlPc: item.pictureUrlPc,
                    site: item.site,
                    siteEnglish: item.siteEnglish,
                    context: item.context,
                    contextEnglish: item.contextEnglish,
                    propertyEnglish: item.propertyEnglish,
                    property: item.property,
                    type: item.type,
                    floorSpace: item.floorSpace, //场地面积
                    floorSpaceEnglish: item.floorSpaceEnglish,
                    coveredArea: item.coveredArea,//建筑面积
                    coveredAreaEnglish: item.coveredAreaEnglish,
                    client: item.client,//业主
                    clientEnglish: item.clientEnglish,
                };
                this.editVisible = true;
                this.fileListPhone = JSON.parse(item.pictureUrlPc);
                this.fileListPhone1 = JSON.parse(item.pictureUrl);

                this.fileList1 = [];
                this.fileListThumbnail = [];
                if (item.thumbnail) {
                    this.fileListThumbnail.push({name: item.thumbnail, url: item.thumbnail});
                }

                    for (let i = 0; i < this.fileListPhone.length; i++) {
                        this.fileList1.push({name: this.fileListPhone[i], url: this.fileListPhone[i]});
                    }

            },
            handlePasswordEdit(index, row) {
                this.show = false;
                this.idx = index;
                const item = this.tableData[index];

                this.form = {
                    name: item.name,
                    id: item.id,
                    gender: item.gender,
                    roleId: item.roleId,
                    email: item.email,
                    mobile: item.mobile
                };

                this.passwordVisible = true;
            },
            handleDelete(index, row) {
                this.form = row;
                this.idx = index;
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            saveEdit(formName) {
            if(this.fileListPhone==null || this.fileListPhone.length<1){
              this.$message.error(`图片没上传`);
              return;
            }
              this.form.pictureUrlPc=JSON.stringify( this.fileListPhone);
              this.form.pictureUrl=JSON.stringify(this.fileListPhone1);
                this.$refs.userform.validate(valid => {
                    if (valid) {
                        if (this.form.id == "") {

                            let fd = JSON.parse(JSON.stringify(this.form));
                            delete fd.id;

                            this.$axios.post("/project/addProject", fd).then(res => {
                                if (!res.success) {
                                    this.$message.success(res.errMsg);
                                    return;
                                }
                                this.$message.success(`操作成功`);
                                this.getData();
                                this.editVisible = false;
                            });
                        } else {
                            this.$axios.post("/project/updateProject", this.form).then(res => {
                                if (!res.success) {
                                    this.$message.success(res.errMsg);
                                    return;
                                }
                                this.$message.success(`操作成功`);
                                this.getData();
                                this.editVisible = false;
                            });
                        }
                    }
                });

            },
            // 确定删除
            deleteRow() {
                this.$axios
                    .post("/project/delProject", {id: this.form.id})
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
</style>
