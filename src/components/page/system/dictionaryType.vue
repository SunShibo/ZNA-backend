<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 字典分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search" :loading="$store.state.requestLoading" >搜索</el-button>
                <el-button type="primary" icon="add" @click="add">新增</el-button>
            </div>
            <el-table v-loading="$store.state.requestLoading"  :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                
                <el-table-column prop="keyName" label="名称"></el-table-column>
                <el-table-column prop="valueName" label="名称值"></el-table-column>
                <el-table-column prop="rank" label="排序"></el-table-column>
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
            <el-form  ref="form" :model="form" label-width="50px">
                
                <el-form-item label="名称" :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]" prop="keyName">
                    <el-input  v-model="form.keyName"></el-input>
                </el-form-item>
                <el-form-item label="名称值" :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]" prop="valueName">
                    <el-input  v-model="form.valueName"></el-input>
                </el-form-item>
                <el-form-item label="排序" :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]" prop="rank">
                    <el-input type="number" v-model="form.rank"></el-input>
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
        name: 'dictionaryType',
        data() {
            return {
           
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    keyName: '',
                    valueName: '',
                    id: '',
                    rank: 0
                },
                idx: -1,
               

            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData
            }
        },
        methods: {
          
            getData() {
               
                this.$axios.post("/Dictionariestype/queryDictionariestype", {
                    keyName: this.select_word.trim()
                }).then((res) => {
                    this.tableData = res.data;
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
                    keyName: '',
                    valueName:'',
                    rank: 0,
                }
            },
     
            handleEdit(index, row) {
                
               
                this.form = row;
                
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
                // this.del_list = this.del_list.concat(this.multipleSelection);
               for (let i = 0; i < length; i++) {
                    str.push(this.multipleSelection[i]['id']);
                }
                this.$axios.post("/Dictionariestype/deleteDictionariestype",{DcId:'['+str.join(",")+']'}).then((res) => {
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
          
                
                if(this.form.id==""){
                    //新增
                    let fd = JSON.parse(JSON.stringify(this.form));
                    delete fd.id;
                    this.$axios.post("/Dictionariestype/addDictionariestype", fd).then((res) => {          
                        if(!res.success){
                            this.$message.error(res.errMsg);
                            return;
                        }
                        this.$message.success(`操作成功`);
                        this.getData();
                        this.editVisible = false;
                    })
                }else{
                    //编辑
                    delete this.form.updateTime;
                    this.$axios.post("/Dictionariestype/updateDictionariestype", this.form).then((res) => {          
                        if(!res.success){
                            this.$message.error(res.errMsg);
                            return;
                        }
                        this.$message.success(`操作成功`);
                        this.getData();
                        this.editVisible = false;
                    })
                }
            },
            // 确定删除
            deleteRow(){
             
                this.$axios.post("/Dictionariestype/deleteDictionariestype", {DcId:'['+this.form.id+']'}).then((res) => {
                        if(!res.success){
                            this.$message.error(res.errMsg);
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
