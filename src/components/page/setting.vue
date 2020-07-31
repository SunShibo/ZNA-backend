<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 参数配置
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      
      <el-table
        v-loading="$store.state.requestLoading"
        :data="data"
        border
        class="table"
        ref="multipleTable"
        
        @selection-change="handleSelectionChange">
        <el-table-column prop="key" label="key"></el-table-column>
        <el-table-column prop="values" label="value"></el-table-column>
        <el-table-column prop="comment" label="备注"></el-table-column>
        
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
          
          </template>
        </el-table-column>
      </el-table>
    </div>
  
    <!-- 编辑弹出框 -->
    <el-dialog title="新增/编辑" :visible.sync="editVisible" width="70%" :close-on-click-modal="closeOnClickModal">
      <el-form ref="form" :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <!-- <el-form-item label="key">
              <el-input v-model="form.key"></el-input>
            </el-form-item> -->
            <el-form-item label="values">
              <el-input type="number" v-model="form.values"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="form.comment"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
export default {
    name: 'setting',
  data() {
    return {
      showOverflowTooltip:true,
      editVisibleFullText:false,
      form:{
        id:'',key:'',value:'',remark:''
      },
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      editVisible: false,
      delVisible: false,
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
    onEditorChange({editor, html, text}) {//change事件
        this.content = html;
    },

    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      this.$axios
        .post("/keyVal/selectAll", this.search)
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
        key: "",
        values: "",
        comment: "",
        
      };
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        id: item.id,
        key: item.key,
        values:item.values,
        comment: item.comment,
      };
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.form = row;
      this.idx = index;
      this.delVisible = true;
    },
    delAll() {
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //保存编辑
    saveEdit() {
       let fd = JSON.parse(JSON.stringify(this.form));
        var re = /^[0-9]+$/ ;
        if(!re.test(fd.values)){
           this.$message.error("values必须是正整数");
          return false;
        }
  
        delete fd.key;
        //编辑
        this.$axios.post("/keyVal/updateVal", fd).then(res => {
          if (!res.success) {
            this.$message.success(res.errMsg);
            return;
          }
          this.$message.success(`操作成功`);
          this.getData();
          this.editVisible = false;
        });
      
    },
    // 确定删除
    deleteRow() {
      this.$axios
        .post("/helpCenter/deleteHelpContent", { id: this.form.id })
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
  &:last-child {
    margin-bottom: 0;
  }
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
