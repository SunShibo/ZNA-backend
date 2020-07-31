<template> <!--以修改-->
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 核心团队
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
                <el-table-column label="缩略图" prop="headPortraitPc" width="80">
                    <template slot-scope="scope">
                        <img :src="scope.row.headPortraitPc" alt="" style="width: 50px;height: 50px">
                    </template>
                </el-table-column>
                <el-table-column label="中文名称"  prop="name"  width="170"></el-table-column>
                <el-table-column label="英文名称"  prop="nameEnglish"  width="200"></el-table-column>
                <el-table-column label="排序"  prop="sort"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="职位中"  prop="position" width="150"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="职位英"  prop="positionEnglish" width="150"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="简介中"  prop="intro" width="300"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="简介英"  prop="introEnglish" width="300"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="教育背景中"  prop="educational" width="200"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="教育背景英"  prop="educationalEnglish" width="200"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="资质缩写"  prop="aptitudeAbbreviation" width="150"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="专业资质中"  prop="aptitude" width="250"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="专业资质英"  prop="aptitudeEnglish" width="250"></el-table-column>
                <el-table-column label="操作" width="230" align="center"  fixed="right" >
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                @click="handleEdit(scope.$index, scope.row)"
                        >
                        </el-button>
                        <el-button
                            type="text"
                            @click="handleEdit(scope.$index, scope.row)"
                    >编辑
                    </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="updateProject(scope.$index, scope.row)"
                        >编辑项目
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
                        <el-form-item required="" label="中文名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="英文名称">
                            <el-input v-model="form.nameEnglish"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="排序">
                            <el-input type="number" v-model="form.sort"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="资质缩写">
                            <el-input v-model="form.aptitudeAbbreviation"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="职位中">
                            <el-input type="text" v-model="form.position"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="职位英">
                            <el-input  type="text"  v-model="form.positionEnglish"></el-input>
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
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item required="" label="简介中">
                            <quill-editor ref="newEditor" v-model="form.intro" :options="editorOption"></quill-editor>
                        </el-form-item>
                        <el-form-item required="" label="教育背景中">
                            <quill-editor ref="newEditor" v-model="form.educational" :options="editorOption"></quill-editor>
                        </el-form-item>
                        <el-form-item required="" label="专业资质中">
                            <quill-editor ref="newEditor" v-model="form.aptitude" :options="editorOption"></quill-editor>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item required="" label="简介英">
                            <quill-editor ref="newEditor" v-model="form.introEnglish" :options="editorOption"></quill-editor>
                        </el-form-item>
                        <el-form-item required="" label="教育背景英">
                            <quill-editor ref="newEditor" v-model="form.educationalEnglish" :options="editorOption"></quill-editor>
                        </el-form-item>
                        <el-form-item required="" label="专业资质英">
                            <quill-editor ref="newEditor" v-model="form.aptitudeEnglish" :options="editorOption"></quill-editor>
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

<!--  -->
        <!-- 编辑项目弹出层 -->
        <el-dialog title="编辑项目" :visible.sync="project" width="700px" center>
                <div style="height:400px;overflow:auto">
                    <el-tree
                            :data="menu"
                            show-checkbox
                            :default-checked-keys="keys"
                            node-key="id"
                            ref="tree"
                            :props="defaultProps">
                    </el-tree>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="project = false">取 消</el-button>
                <el-button type="primary" :loading="$store.state.requestLoading" @click="projectSave">确 定</el-button>
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
                // 默认显示第几页
                currentPage:1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount:0,
                // 个数选择器（可修改）
                pageSizes:[10,20,50,100],
                // 默认每页显示的条数（可修改）
                PageSize:10,
                s_title:'',
                menu: [],
                keys: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                 },
                tableData: [],
                multipleSelection: [],
                editVisible: false,
                delVisible: false,
                project: false,
                form: {
                    id: "",
                    name:"", //中文名
                    nameEnglish:"", //英文名
                    sort:0,
                    position:"",//职位
                    positionEnglish:"",//职位
                    educational:"",//教育背景
                    educationalEnglish:"",//教育背景
                    aptitude:"",//专业资质
                    aptitudeEnglish:"",//专业资质
                    intro:"",//简介
                    introEnglish:"",//简介
                    headPortrait: "",
                    headPortraitPc: "",
                    aptitudeAbbreviation: "",

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
                this.form.headPortrait = res.data.picturePhone;
                this.form.headPortraitPc=res.data.picturePC;
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
                this.$axios.post("/team/getTeamBO",{
                    pageNo:this.currentPage,
                    pageSize:this.PageSize,
                }, this.search)
                    .then(res => {
                        this.tableData = res.data.teamBOS;
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
                    name:"", //中文名
                    nameEnglish:"", //英文名
                    sort:0,
                    position:"",//职位
                    positionEnglish:"",//职位
                    educational:"",//教育背景
                    educationalEnglish:"",//教育背景
                    aptitude:"",//专业资质
                    aptitudeEnglish:"",//专业资质
                    intro:"",//简介
                    introEnglish:"",//简介
                    headPortrait: "",
                    headPortraitPc: "",
                };
                this.pictureUrl = [];//缩略图
            },

            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.pictureUrl = [];//缩略图
                this.form = {
                    id: item.id,
                    name:item.name, //中文名
                    nameEnglish:item.nameEnglish, //英文名
                    sort:item.sort,
                    position:item.position,//职位
                    positionEnglish:item.positionEnglish,//职位
                    educational:item.educational,//教育背景
                    educationalEnglish:item.educationalEnglish,//教育背景
                    aptitude:item.aptitude,//专业资质
                    aptitudeEnglish:item.aptitudeEnglish,//专业资质
                    intro:item.intro,//简介
                    introEnglish:item.introEnglish,//简介
                    headPortrait: item.headPortrait,
                    headPortraitPc: item.headPortraitPc,
                    aptitudeAbbreviation: item.aptitudeAbbreviation,
                };
                if (!!item.headPortraitPc) {
                    this.pictureUrl .push({name: item.headPortraitPc, url: item.headPortraitPc});//缩略图
                }
                this.editVisible = true;
            },
            updateProject(index, row) {
                    this.form.id=row.id;
                    let arr = [];
                    this.$axios.post("/project/getProjectIdList").
                    then(res => {
                            this.menu= res.data;
                            let key=row.projectPicture;
                            console.log(key);
                            if(!!key){
                                for(let i=0;i<key.length;i++){
                                   arr.push(key[i].id)
                                }
                            }

                        this.project = true;
                    });
                this.keys=arr;
            },
            handleDelete(index, row) {
                this.form = row;
                this.idx = index;
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 项目修改保存
            projectSave(){
                let data = this.$refs.tree.getCheckedKeys();
                data = data.filter(item => !!item);
                this.$axios.post("/team/updateTeamProject",{teamId: this.form.id,projectIds:'['+data.join(",")+']'}).
                then(res => {
                    if (res.success) {
                        this.$message.success("修改成功");
                    }

                });
                this.getData();
                setTimeout(()=>{
                    this.project = false;
                },1000);
            },
            // 保存编辑
            saveEdit() {
                let fd = JSON.parse(JSON.stringify(this.form));

               if (!fd.headPortraitPc) {
                    this.$message.error("图片必须上传");
                    return false;
                }

                if (this.form.id == "") {
                    delete fd.id;
                    this.$axios.post("/team/addTeamBO", fd).then(res => {
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
                    this.$axios.post("/team/updTeamBO", fd).then(res => {
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
                    .post("/team/delTeamBO", {id: this.form.id})
                    .then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }
                        this.tableData.splice(this.idx, 1);
                        this.totalCount=this.totalCount-1;
                        console.log(this.idx);
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