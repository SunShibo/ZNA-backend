<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>权限列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-container>
                <el-aside width="250px" style="border-right:1px solid #eee">
                    <el-tree 
                        :data="menu" 
                        v-loading="$store.state.requestLoading" 
                        @node-click="handleNodeClick" 
                        node-key="id" 
                        ref="tree" 
                        :default-expand-all="true" 
                        :props="defaultProps">
                    </el-tree>   
                </el-aside>
                <el-main>
                    <el-form ref="form"  :rules="rules"  :model="form" label-width="80px">
                        <el-form-item label="名称" prop="menuName">
                            <el-input v-model="form.menuName"></el-input>
                        </el-form-item>
                        <el-form-item label="跳转" prop="index">
                            <el-input v-model="form.index"></el-input>
                        </el-form-item>
                        <el-form-item label="URL" prop="url">
                            <el-input v-model="form.url"></el-input>
                        </el-form-item>
                        <el-form-item label="图标" >
                            <el-input v-model="form.icon"></el-input>
                        </el-form-item>
                        <el-form-item label="父菜单">
                            <el-select v-model="form.pid" clearable placeholder="请选择" style="width:260px">
                                <el-option
                                    v-for="item in options"
                                    :key="item.id"
                                    :label="item.menuName"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button icon="el-icon-roundaddfill" type="primary" @click="onSubmit(1)" :loading="$store.state.requestLoading" >新增菜单</el-button>
                            <el-button icon="el-icon-edit" type="primary" @click="onSubmit(2)" :loading="$store.state.requestLoading" >编辑菜单</el-button>
                            <el-button icon="el-icon-delete" type="danger" @click="onSubmit(3)" :loading="$store.state.requestLoading" >删除菜单</el-button>
                        </el-form-item>
                        </el-form>
                </el-main>
            </el-container>

        </div>


        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定删除 {{form.menuName}} ？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" :loading="$store.state.requestLoading"  @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'rule',
        data() {
            return {
                defaultProps: {
                    children: 'ch',
                    label: 'menuName'
                },
                menu: [],
                options:[],
                delVisible:false,
                form:{
                    id:"",
                    icon:"",
                    menuName:"",
                    index:"",
                    pid:"",
                    url: ''
                },
                rules: {
                   
                    menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur"}],
                    // icon: [{ required: true, message: "请输入图标", trigger: "blur" }],
                    index: [{ required: true, message: "请输入跳转方法", trigger: "blur" }],
                    url: [{ required: true, message: "请输入URL", trigger: "blur" }]
                }
            
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {

            }
        },
        methods: {
            handleNodeClick(data) {
                this.form = data;
            },
            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
            },
           onSubmit(v) {
              if(v==3){
                if(this.form.id==""){
                    this.$message.error("您没有选择要删除的对象");
                    return;
                }
                this.delVisible = true;
              }else{

                
                this.$refs['form'].validate(valid => {
                    if (!valid) {return false;}
                    let pd = this.form;
                    
                    if(v==1) delete pd.id
                    if(!pd.pid) pd.pid = 0
                    pd.status = 'menu'
                    if(pd.updateTime) delete pd.updateTime;
                    if(pd.createTime) delete pd.createTime;
                    delete pd.menuBO;
                    this.$axios.post(v==1?'/admin/addMenu':'/admin/editMenu',pd).then((res) => {
                        this.dealResult(res);
                    })
                })
               }
                
            },
            getData() {
             
                this.$axios.post("/admin/getMenuList", {
                    
                }).then((res) => {
                     this.menu = res.data;
                     this.options = res.data.concat([{id:0,menuName:"没有父菜单"}]); 
                })
            },
          
            // 确定删除
            deleteRow(){
                this.$axios.post("/admin/delMenu", {
                    id:this.form.id
                }).then((res) => {
                     this.dealResult(res);
                })
                
            },
            dealResult(res){
                if (!res.success) {
                    this.$message.error(res.errMsg);
                    this.delVisible = false;
                    return;
                }
                this.getData();
                this.$message.success('操作成功');
                this.delVisible = false;
                this.form={
                            id:"",
                            icon:"",
                            menuName:"",
                            index:"",
                            pid:""
                        }
            }
        }
    }

</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
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
