<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 反馈列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <label>是否阅读： </label>
        <el-select v-model="s_read" :clearable="false" class="handle-input mr10">
            <el-option
              v-for="item in options"
              :key="item.key"
              :label="item.v"
              :value="item.key"
            ></el-option>
          </el-select>
        <el-button type="primary" icon="search" @click="search">查询</el-button>
      
      </div>
      <el-table
        v-loading="$store.state.requestLoading"
        :data="data"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index"    label="序号" align="center" sortable width="50"></el-table-column>
        <el-table-column prop="contactWay"   label="联系方式"></el-table-column>
        <el-table-column prop="contactNumber"     label="联系号码"></el-table-column>
        <!--<el-table-column prop="image" label="图片">-->
          <!--<template slot-scope="scope">-->
            <!--&lt;!&ndash; <img :src="scope.row.image" style="widht:100px">   &ndash;&gt;-->
             <!--<el-popover trigger="hover" placement="top" v-if="scope.row.image">-->
                <!--<img :src="scope.row.image" >-->
                <!--<div slot="reference" class="name-wrapper">-->
                  <!--<img :src="scope.row.image" style="height:30px;">-->
                <!--</div>-->
            <!--</el-popover>-->
          <!--</template>-->
        <!--</el-table-column>-->
        
        <el-table-column prop="createtime" :formatter="formatTime" label="创建时间"></el-table-column>
        <el-table-column prop="status" label="状态" :formatter="formatRead" ></el-table-column>
         <el-table-column prop="content" label="反馈内容" min-width="200px">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p> {{ scope.row.content }}</p>
              <div slot="reference" class="name-wrapper">
                <p class="ellipsis">{{scope.row.content}}</p>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button
             :loading="$store.state.requestLoading" 
              v-if="scope.row.status=='unread'"
              type="text"
              style="color:red"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >标记已读</el-button>
            <el-button
             :loading="$store.state.requestLoading" 
              v-if="scope.row.status!='unread'"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >标记未读</el-button>
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
    import menu from '../../common/menu'
export default {
  name: "feedBack",
  data() {
       var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if(value.length < 6 || value.length > 18){
            callback(new Error('密码长度错误'));
        } 
        else {
          if (this.form.password !== '' ) {
            this.$refs.form.validateField('passowrd');
          }
          callback();
        }
      };
    return {
         // 总数据
            tableData:[],
            // 默认显示第几页
            currentPage:1,
            // 总条数，根据接口获取数据长度(注意：这里不能为空)
            totalCount:0,
            // 个数选择器（可修改）
            pageSizes:[10,20,50,100],
            // 默认每页显示的条数（可修改）
            PageSize:10,
            s_read:"",
            
     show:true,
      options: [{ key: "", v: "不限" }, { key: "unread", v: "未读" }, { key: "read", v: "已读" }],
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      passwordVisible: false,
      delVisible: false,
      form: {
        name: "",
        id: "",
        password: "",
        gender: "",
        roleId: "",
        email: "",
        mobile: ""
      },
      idx: -1,
      menu: menu,
      defaultProps: {
        children: "children",
        label: "label"
      },
      count: 0,
      value: "male",
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 18, message: "长度在 4 到 18 个字符", trigger: "blur" }
        ],
       
        roleId: [
          {
            required: true,
            message: "请选择一个角色",
            trigger: "change"
          }
        ],
       
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" }
        ]
        
      }
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
        formatTime(row, column) {
        
                const date = new Date(row.createTime.time)
                return date.getFullYear() + '-' +
                  date.getMonth() + '-' +
                  date.getDate() + ' ' +
                  date.getHours() + ':' +
                  date.getMinutes()
        },
        formatRead(row, column) {
        
              return  row.status == 'unread' ? '未读' : '已读'
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
        },
  
    // 获取 easy-mock 的模拟数据
    getData() {
      // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      this.$axios.post("/feedback/selectFeedback", {
        pageNo:this.currentPage,
        pageSize:this.PageSize,
        status:this.s_read,
        
      }).then(res => {
        this.tableData = res.data.data;
        this.totalCount = res.data.count;
      });
    },
 
    search() {
      this.getData();
    },
    add() {
      //添加
      this.editVisible = true;
      
      setTimeout(() => {
           this.$refs['form'].resetFields();
           this.form = {
                        name: "",
                        id: "",
                        password: "",
                        gender: "male",
                        roleId: "",
                        email: "",
                        mobile: ""
                      };
      }, 200);
      this.show = true;
    },

    handleEdit(index, row) {
      
      this.$axios
        .post("/feedback/updateFeedback", { id: row.id,status:row.status == "read" ? 'unread' : 'read'})
        .then(res => {
          if (!res.success) {
            this.$message.success(res.errMsg);
            return;
          }
          this.$message.success("操作成功");
         
          this.getData();
        });
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
        email:item.email,
        mobile:item.mobile 
      };

      this.passwordVisible = true;
    },
    handleDelete(index, row) {
      this.form = row;
      this.idx = index;
      this.delVisible = true;
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
        .post("/admin/delAdmin", { ids: str.join(",") })
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // savePassword，设置密码编辑保存
    // 保存编辑
    savePassword(formName) {
      if(this.form.password.length<6||this.form.password.length>18){
         this.$message.error("密码长度需设置6到18位");
        return false;
      }
      
      this.$axios.post("/admin/changePassword", {id:this.form.id,password:this.form.password}).then(res => {
                    if (!res.success) {
                    this.$message.success(res.errMsg);
                    return;
                    }
                    this.$message.success(`操作成功`);
                    this.getData();
                    this.passwordVisible = false;
                });
      t
    },
    saveEdit(formName) {
      // admin/adminRegister
      
      this.$refs['form'].validate(valid => {
        if (valid) {
           // debugger;
            if (this.form.id == "") {
                if(this.form.password.length<6||this.form.password.length>18){
                    this.$message.success(`密码需要设置6到18位`);
                    return false;
                }
                let fd = JSON.parse(JSON.stringify(this.form));
                delete fd.id;
                this.$axios.post("/admin/adminRegister", fd).then(res => {
                    if (!res.success) {
                    this.$message.success(res.errMsg);
                    return;
                    }
                    this.$message.success(`操作成功`);
                    this.getData();
                    this.editVisible = false;
                });
            }else{

                this.$axios.post("/admin/updateAdminUser", this.form).then(res => {
                    if (!res.success) {
                    this.$message.success(res.errMsg);
                    return;
                    }
                    this.$message.success(`操作成功`);
                    this.getData();
                    this.editVisible = false;
                });
            }
        } else {
          console.error("error submit!!");
          return false;
        }
      });

    },
    // 确定删除
    deleteRow() {
      this.$axios
        .post("/admin/delAdmin", { ids: this.form.id })
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
.ellipsis{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
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
