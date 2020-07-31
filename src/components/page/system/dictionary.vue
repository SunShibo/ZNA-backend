<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 数据字典</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-select v-model="search_value" filterable  placeholder="请选择分类" style="margin-right:10px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                    v-for="item in dictionaryTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    ></el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="add" @click="add">新增</el-button>
            </div>  
            <el-table v-loading="$store.state.requestLoading"  :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="分类值"></el-table-column>
                <el-table-column prop="value" label="字典名称"></el-table-column>
                <el-table-column prop="sort" label="排序"></el-table-column>
                
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog  title="新增/编辑" :visible.sync="editVisible" width="30%" :close-on-click-modal="closeOnClickModal">
            <el-form  ref="dicForm" :model="form" label-width="100px">
                <el-form-item label="字典分类" prop="kid" :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                    <el-select v-model="form.kid" filterable style="margin-right:10px;">
                    <el-option
                    v-for="item in dictionaryTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    ></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="字典名称" prop="value" :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                    <el-input  v-model="form.value"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort" :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                    <el-input type="number" v-model="form.sort"></el-input>
                </el-form-item>
               
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
                <el-button type="primary"  :loading="$store.state.requestLoading" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'dictionary',
        data() {
            return {
           
                search_value:"",
                dictionaryTypes:[],
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    id: '',
                    value: '',
                    sort: 0,
                    kid: ''
                },
                idx: -1,
               

            }
        },
        created() {
            this.getData();
            this.getDictionaryTypes();
        },
        computed: {
            data() {
                return this.tableData
            }
        },
        methods: {
            
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            
            getData() {
               
                this.$axios.post("/Dictionary/getDic", {
                    kid: this.search_value
                }).then((res) => {
                    this.tableData = res.data;
                })
            },
          
            getDictionaryTypes() {
               
                this.$axios.post("/Dictionary/getDictionaryBOs").then((res) => {
                    
                    this.dictionaryTypes = res.data;
                })
            },
            
            search() {
                this.getData();
            },
            add() {
               //添加
               this.editVisible = true;
               this.form = {
                    id: '',
                    rank: 0,
                    value:"",
                    outer:""
                }
               
                
            },
     
            handleEdit(index, row) {
                
                this.idx = index;
                const item = this.tableData[index];
           
                this.form = {
                    id:item.id,
                    value:item.value,
                    sort: item.sort,
                    kid:item.kid
                }
                
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.form = row;
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                
                const length = this.multipleSelection.length;
                if(length==0)return;
                if(!confirm(`您确定要删除 ${length} 条数据吗？`))return;
                let str = [];
                
               for (let i = 0; i < length; i++) {
                    str.push(this.multipleSelection[i]['id']);
                }
                this.$axios.post("/Dictionary/delDic", {DcId:'['+str.join(",")+']'}).then((res) => {
                        if(!res.success){
                            this.$message.success(res.errMsg);
                            return;
                        }  
                       
                        this.$message.success('删除成功');
                        this.delVisible = false;
                        this.getData();
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$refs.dicForm.validate((valid) => {
                    if (valid) {
                        if(this.form.id==""){
                            //新增
//                    let fd = JSON.parse(JSON.stringify(this.form));
//
//                         if(!fd.outer){
//                            this.$message.error("字典分类必须选择");
//                            return false;
//                        }
//                        if(!fd.value){
//                            this.$message.error("字典名称不能为空");
//                            return false;
//                        }
//                        if(!fd.key){
//                            this.$message.error("字典值不能为空");
//                            return false;
//                        }

                            this.$axios.post("/Dictionary/addDic", this.form).then((res) => {
                                if(!res.success){
                                this.$message.error(res.errMsg);
                                return;
                            }
                                this.$message.success(`操作成功`);
                                this.getData();
                                this.editVisible = false;
                            });
                        }else{
                            //编辑

                            this.$axios.post("/Dictionary/updDic", this.form).then((res) => {
                                if(!res.success){
                                this.$message.success(res.errMsg);
                                return;
                            }
                                this.$message.success(`操作成功`);
                                this.getData();
                                this.editVisible = false;
                            });
                        }
                    } else {
                        console.error('error submit!!');
                        return false;
                    }
                });
            },
            // 确定删除
            deleteRow(){
             
                this.$axios.post("/Dictionary/delDic", {DcId:'['+this.form.id+']'}).then((res) => {
                        if(!res.success){
                            this.$message.success(res.errMsg);
                            return;
                        }  
                        this.tableData.splice(this.idx, 1);
                        this.$message.success('删除成功');
                        this.delVisible = false;
                })
               
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
