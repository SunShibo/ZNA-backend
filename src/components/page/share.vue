<template>
    <!--在此处添加渲染的内容-->
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 分享配置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="tableData" border class="table" ref="multipleTable">
                <el-table-column prop="value" label="图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.value" alt="" width="100px" height="100px">
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column label="操作" align="center" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog @close="closeDialog" :visible.sync="dialogShareVisible">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="背景图片">
                        <UpLoad
                                :class="{'hide': hideUpload, 'upload-item':true}"
                                idName="uploadImageShare"
                                :onSuccess="handleImageAndTextSuccess"
                                :onUpLoadBeforeUpload="beforeUpload"
                                :onUpLoadSuccess="handleOnSuccess"
                                :onUpLoadError="onUpLoadError"
                                :onUpLoadPreView="handlePictureCardPreview"
                                :onUpLoadRemove="onRemove"
                                :multiple="false"
                                videoType="questions"
                                :drag="false"
                                :fileList="imageText"
                                accept="image/*"
                                refUpLoad="uploadImageShare"
                                listType="picture-card"></UpLoad>
                    </el-form-item>

                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="form.remark"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :visible.sync="dialogVisible" >
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">

    import UpLoad from '../common/Upload.vue';
    //将渲染的内容导出
    export default{
        props: {},
        data(){
            return {
                tableData: [],//表格数据
                hideUpload: false,//是否隐藏上传按钮
                dialogVisible: false,//弹出层显示
                dialogShareVisible: false, //弹出层显示
                dialogImageUrl: '',  //查看大图时的图片地址
                imageText: [{url: '',name: ''}],//上传图片的数据
                form: {
                    value: '',
                    remark: '',
                    key: '',
                    id: 0,
                }
            }
        },
        methods: {
            onUpLoadError(err){//上传Error
                console.error(err);
                this.$message.success('上传失败，请重新上传！');
            },
            handleImageAndTextSuccess(response, file){
                this.hideUpload = true;
            },
            handlePictureCardPreview(file) {//点击图文匹配题的放大按钮
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            beforeUpload(){//上传前的回调
                return new Promise((resolve, reject) => {
                    this.loading = this.$loading({});
                    resolve(true);
                });
            },
            handleOnSuccess(response, file){//图片上传完成后
                this.form.value = response;
                this.loading.close();
                this.$message.success('上传成功！');
            },
            onRemove(file, fileList){//删除列表图片的事件
                this.hideUpload = false;
            },
            getData(){//查询数据
                this.$axios({
                    url: '/share/queryShare',
                    method: 'POST'
                }).then(res => {
                    this.tableData = res.data;
                });
            },
            onSubmit(){
                console.log(this.form);
                this.$axios({
                    url: '/share/updateShare',
                    method: 'POST',
                    data: {...this.form},
                }).then(res => {
                    this.imageText = [];
                    this.hideUpload = false;
                    this.$message.success('修改成功');
                    this.dialogShareVisible = false;
                })
            },
            handleEdit(index, row){//编辑
                this.hideUpload = true;
                let value = row.value ? row.value.split('/') : "";
                this.$set(this.imageText, 0, {url: row.value, name: !!value ? value[value.length - 1] : ''});
                this.form = {...row};
                this.dialogShareVisible = true;

            },
            closeDialog(){
                this.hideUpload = false;
                this.imageText = [];
                this.getData();
            }
        },
        components: {UpLoad},
        computed: {},
        watch: {},
        created(){
            this.getData();
        },
        mounted(){
        },

    }
</script>

<style scoped>
    /**渲染内容的样式**/

    .upload-item {
        display: inline-block
    }
</style>