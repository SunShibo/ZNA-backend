<template>
    <!--在此处添加渲染的内容-->
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 题库管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <keep-alive>
                <div class="handle-box">
                    <el-form :inline="true" :model="query" class="demo-form-inline">
                        <el-form-item>
                            <el-button type="primary" icon="search" @click="delAll">批量删除</el-button>
                            <el-button type="primary" icon="search" @click="questionAdd">添加试题</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="query.questionType" placeholder="请选择试题类型">
                                <el-option value="" label="全部类型"></el-option>
                                <el-option
                                        v-for="item in questionType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="query.testType" @change="testTypeChange" placeholder="请选择分类类型">
                                <el-option value="" label="全部分类"></el-option>
                                <el-option
                                        v-for="item in testType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <transition name="el-fade-in-linear">
                            <el-form-item v-show="isLanguage||isLanguageAndCourse||isAll">
                                <el-select v-model="search.selectLanguage" @change="languageChange" filterable
                                           placeholder="请选择语言">
                                    <el-option value="" label="全部语言"></el-option>
                                    <el-option
                                            v-for="item in language"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </transition>
                        <transition name="el-fade-in-linear">
                            <el-form-item v-show="isLanguageAndCourse||isAll">
                                <el-select v-model="search.selectCourse" @change="courseChange" filterable
                                           placeholder="请选择课程">
                                    <el-option value="" label="全部课程"></el-option>
                                    <el-option
                                            v-for="item in course"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </transition>
                        <transition name="el-fade-in-linear">
                            <el-form-item v-show="isAll">
                                <el-select v-model="search.selectLevel" @change="levelChange" filterable
                                           placeholder="请选择级别">
                                    <el-option value="" label="全部级别"></el-option>
                                    <el-option
                                            v-for="item in level"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </transition>
                        <transition name="el-fade-in-linear">
                            <el-form-item v-show="isAll">
                                <el-select v-model="query.relevanceId" filterable placeholder="请选择课时">
                                    <el-option value="" label="全部课时"></el-option>
                                    <el-option
                                            v-for="item in chapter"
                                            :key="item.id"
                                            :label="item.chapterName"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </transition>
                        <el-form-item>
                            <el-button type="primary" icon="search" @click="conditionalQuery">搜索</el-button>
                            <el-button type="primary" @click="importFile">导入题库素材</el-button>
                            <el-button type="primary" @click="importQuestionFile">导入试题</el-button>

                        </el-form-item>
                    </el-form>
                </div>
            </keep-alive>
            <el-table :data="tableData" border class="table" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column prop="topic" label="题目" :show-overflow-tooltip="true" align="center"
                                 :formatter="formatTopic">
                </el-table-column>
                <el-table-column prop="option" label="选项" align="center" :show-overflow-tooltip="true"
                                 :formatter="formatOption">
                </el-table-column>
                <el-table-column prop="answer" label="答案和解析" align="center" :show-overflow-tooltip="true"
                                 :formatter="formatAnswer">
                </el-table-column>
                <el-table-column prop="score" label="分值" align="center" :formatter="formatScore" sortable>
                </el-table-column>
                <el-table-column prop="questionType" label="试题类型" align="center" :formatter="formatQuestionType">
                </el-table-column>
                <el-table-column prop="testType" label="类型分类" align="center" :formatter="formatTestType">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" sortable :formatter="formatDate">
                </el-table-column>
                <el-table-column label="操作" align="center" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        :page-sizes="page.pageSizes"
                        :page-size="page.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        @current-change="handleCurrentChange"
                        :total="total">
                </el-pagination>
            </div>

        </div>
        <!-- 导入题库材料 -->
        <el-dialog title="" @close="conditionalQuery" :visible.sync="importVisible" width="70%">
            <el-form label-width="100px">
                <el-form-item label="导入题库素材">
                    <UpLoad
                            idName="importUpload"
                            :onUpLoadSuccess="importSuccess"
                            :onUpLoadError="onUpLoadError"
                            :multiple="true"
                            :drag="true"
                            :fileList="importData"
                            accept="image/*,audio/*"
                            refUpLoad="importUpload"
                            listType="picture"
                            :randomName="false"
                            :filesNumber="999"></UpLoad>
                    <div style="color:#ff4d51;">
                        <p>图片地址为：http://duoyuka.oss-cn-beijing.aliyuncs.com/上传文件名</p>
                        <p>例如：http://duoyuka.oss-cn-beijing.aliyuncs.com/1560482356724.png</p>
                        <p>提示：同名文件会覆盖</p>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="importVisible = false">关闭</el-button>
      </span>
        </el-dialog>


        <!-- 导入试题 -->
        <el-dialog title="" @close="conditionalQuery" :visible.sync="importQuestionVisible" width="40%">
            <el-form label-width="100px">
                <el-form-item label="导入试题">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-upload
                                    ref="questionUpload"
                                    class="upload-demo"
                                    action="/question/importQuestions"
                                    name="file"
                                    :show-file-list="false"
                                    :before-upload="importQuestionsUpload"
                                    :on-error="importQuestionsError"
                                    :on-progress="importQuestionsProgress"
                                    :on-success="importQuestionsSuccess"
                                    :limit="1">
                                <div class="el-upload__tip red" slot="tip">请上传Excel文件 Excel版本不能低于2007</div>
                                <el-button size="small" type="primary">选取文件</el-button>
                            </el-upload>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div class="info" v-html="importContent"></div>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="importQuestionVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import UpLoad from '../../common/Upload.vue';

    //将渲染的内容导出
    export default{
        name: 'QuestionsManage',
        props: {},
        data(){
            return {
                importContent: '',
                importVisible: false,
                importQuestionVisible: false,
                importData: [],
                tableData: [],//数据
                url: '/Order/queryOrderById',//请求地址
                page: {//分页
                    pageSize: 10,
                    pageNo: 1
                },
                // 个数选择器（可修改）
                pageSizes: [10, 20, 50, 100],

                query: {
                    testType: '',
                    questionType: '',
                    relevanceId: ''
                },
                search: {
                    selectLanguage: '',//选中的语言数据
                    selectCourse: '',//选中的课程数据
                    selectLevel: ''//选中的级别数据
                },
                isLanguage: false,//控制语言显示
                isLanguageAndCourse: false,//控制语言、课程显示
                isAll: false,//控制语言、课程、级别、课时显示
                total: 0,//总条数
                questionType: [//试题类型
                    {
                        value: 'judge',
                        label: '判断题'
                    },
                    {
                        value: 'read',
                        label: '阅读题'
                    },
                    {
                        value: 'common',
                        label: '常规题'
                    },
                    {
                        value: 'translate',
                        label: '翻译题'
                    },
                    {
                        value: 'write',
                        label: '拼写题'
                    },
                    {
                        value: 'hearingAndTest',
                        label: '听力和文本匹配题'
                    },
                    {
                        value: 'hearingAndSentence',
                        label: '听音完成句子题'
                    },
                    {
                        value: 'imageText',
                        label: '图文匹配题'
                    },
                    {
                        value: 'follow',
                        label: '听音跟读题'
                    }
                ],
                testType: [//试题分类
                    {
                        value: 'languageTest',
                        label: '语言能力测试'
                    },
                    {
                        value: 'courseCertificate',
                        label: '课程考证题'
                    },
                    {
                        value: 'warmUp',
                        label: '学前热身'
                    },
                    {
                        value: 'test',
                        label: '课后测试'
                    }
                ],
                language: [],//语言数据
                course: [],//课程数据
                level: [],//级别数据
                chapter: [],//课时数据
                del_list: []//删除数组
            }
        },
        methods: {
            onUpLoadError(err){//上传Error
                console.error(err);
                this.$message.success('上传失败，请重新上传！');
            },
            importQuestionsError(err, file, fileList){
                this.printLog('error', "Error：上传失败！");
            },
            importQuestionsProgress(event, file, fileList){
                let progress = Math.ceil(event.percent);
                this.printLog('success', 'Success：文件上传中！已上传' + (progress === 100 ? 99 : progress) + "%");
            },
            importQuestionsUpload(file){//上传试题文件前
                this.printLog('success', 'Success：准备上传中！');
//                const type = file.type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
//                if (!type) {
//                    this.printLog('error', 'Error：文件格式不匹配！（只支持上传后缀名为.xls和.xlsx）');
//                }
                return true;
            },
            importQuestionsSuccess(response, file, fileList){//上传试题文件成功后
                this.printLog('success', 'Success：文件上传中！已上传100%');
                if (response.success) {
                    this.printLog('success', 'Success：文件上传成功！');
                } else {
                    this.printLog('error', 'Error：' + response.errMsg);
                }
                setTimeout(() => {
                    this.$refs.questionUpload.clearFiles();
                }, 1000)
            },
            printLog(state, logContent){//显示日志
                if (state == 'success') {
                    this.importContent += "<div>" + logContent + "</div>"
                } else {
                    this.importContent += "<div style='color:#ff4d51;'>" + logContent + "</div>"
                }
            },
            importQuestionFile(){//打开上传试题弹出层
                this.importQuestionVisible = true;
            },
            importFile(){
                this.importVisible = true;
            },
            importSuccess() {
                this.$message.success('上传成功');
            },
            formatScore(row){//格式化分数
                let score = JSON.parse(row.score), str = '';
                for (let i = 0, len = score.length; i < len; i++) {
                    str += i == len - 1 ? score[i] : score[i] + "/";
                }
                return str;
            },
            formatTopic(row){//格式化题目
                return JSON.parse(row.topic).join('/');
            },
            formatOption(row){//格式化选项
                let optionArr = JSON.parse(row.option), str = '';
                for (let i = 0, len = optionArr.length; i < len; i++) {
                    str += "第" + (i + 1) + "题选项：" + optionArr[i];
                }
                return str;
            },
            formatAnswer(row){//格式化答案和解析
                let answerArr = JSON.parse(row.answer), str = "", option = JSON.parse(row.option);
                let ans = '';
                for (let i = 0, len = answerArr.length; i < len; i++) {
                    str += "第" + (i + 1) + "题 答案：";
                    //判断答案是否有多个 如何是number类型则证明答案有一个不是多选题
                    if (typeof answerArr[i].ans != 'number') {
                        let ansArr = answerArr[i].ans.split(',');
                        ansArr = ansArr.slice(0, -1);
                        for (let j = 0, jlen = ansArr.length; j < jlen; j++) {
                            ans += option[i][ansArr[j]];
                        }
                    } else {
                        ans += option[i][answerArr[i].ans];
                    }

                    str += ans + ' 第一题解析：' + answerArr[i].des;
                }
                return str;
            },
            formatQuestionType(row){//格式化试题类型
                switch (row.questionType) {
                    case 'judge':
                        return '判断题';
                    case 'read':
                        return '阅读理解题';
                    case 'common':
                        return '常规题';
                    case 'translate':
                        return '翻译题';
                    case 'write':
                        return '拼写题';
                    case 'hearingAndTest':
                        return '听力和文本匹配题';
                    case 'hearingAndSentence':
                        return '听音完成句子题';
                    case 'imageText':
                        return '图文匹配题';
                    case 'follow':
                        return '听音跟读题';
                }
            },
            formatTestType(row){//格式化类型分类
                switch (row.testType) {
                    case 'languageTest':
                        return '语言测试题';
                    case 'courseCertificate':
                        return '课程考证题';
                    case 'warmUp':
                        return '学前热身题';
                    case 'test':
                        return '课后测试题';
                }
            },
            questionAdd(){//添加试题
                this.$router.push({path: '/home/QuestionsInfo'});
            },
            handleEdit(index, row){//编辑按钮
                this.$router.push({path: '/home/QuestionsInfo', query: {id: row.id}});
            },
            handleDelete(index, row){//删除按钮
                this.$confirm('此操作删除该试题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: "POST",
                        url: '/question/delQuestion',
                        data: {idArrJSON: JSON.stringify([row.id])}
                    }).then(res => {
                        if (res.success) {
                            this.$message.success('删除成功');
                            this.getData();
                        } else {
                            this.$message.error('删除失败');
                        }
                    })
                });
            },
            delAll(){//批量删除
                if (!this.del_list.length) {
                    this.$message.info("您还没有勾选内容");
                    return;
                }
                this.$axios({
                    method: 'POST',
                    url: '/question/delQuestion',
                    data: {idArrJSON: JSON.stringify(this.del_list)}
                }).then(res => {
                    if (res) {
                        this.$message.success(res.data);
                        //刷新数据
                        this.getData();
                    }
                })
            },
            handleSelectionChange(rowList){//表格复选框选中
                this.del_list = [];
                for (let i = 0, len = rowList.length; i < len; i++) {
                    this.$set(this.del_list, i, rowList[i].id);
                }
            },
            cleanTestType(val){
                val > 4 ? this.search.selectLanguage = '' : '';//清空语言数据
                val > 3 ? this.search.selectCourse = '' : '';//清空课程数据
                val > 2 ? this.search.selectLevel = '' : '';//清空级别数据
                val > 1 ? this.query.relevanceId = '' : '';//清空课时数据
            },

            testTypeChange(val){//试题分类change事件
                //当选中语言测试题时，只显示语音下拉框
                //当选中课程考证题时，只显示语音和课程下拉框
                //当选中学前热身题和课后测试题时，全部都显示

                this.cleanTestType(5);

                this.dynamicSettingSelect(val);
            },
            dynamicSettingSelect(val){//动态设置语言
                switch (val) {
                    case 'languageTest':
                        //查询语言
                        this.queryLanguage();
                        this.isLanguage = true;
                        this.isLanguageAndCourse = false;
                        this.isAll = false;
                        break;
                    case 'courseCertificate':
                        //查询语言
                        this.queryLanguage();
                        this.isLanguageAndCourse = true;
                        this.isLanguage = false;
                        this.isAll = false;
                        break;
                    case 'warmUp':
                    case 'test':
                        //查询语言
                        this.queryLanguage();
                        this.isAll = true;
                        this.isLanguageAndCourse = true;
                        this.isLanguage = true;
                        break;
                    default:
                        this.isLanguage = false;
                        this.isLanguageAndCourse = false;
                        this.isAll = false;
                        break;

                }
            },
            queryLanguage(){//查询语言  获取语言数据
                this.$axios({
                    method: 'POST',
                    url: '/Language/queryLanguageChoice',
                }).then(res => {
                    if (res) {
                        this.language = res.data;
                    }
                });
            },
            languageChange(val){//语言下拉框值改变事件  获取课程数据
                this.cleanTestType(4);
                this.course = [];
                //判断当前值为空或者isLanguageAndCourse为false的时候不进行请求
                if (!val || !this.isLanguageAndCourse) {
                    return;
                }
                this.queryCourse(val);
            },
            queryCourse(id){//请求课程数据
                this.$axios({
                    method: 'POST',
                    url: '/course/queryCourseChoice',
                    data: {languageId: id}
                }).then(res => {
                    if (res) {
                        this.course = res.data;
                    }
                })
            },
            courseChange(val){//课程下拉框值改变事件   获取级别数据
                this.cleanTestType(3);
                this.level = [];
                //判断当前值为空或者isAll为false的时候不进行请求
                if (!val || !this.isAll) {
                    return;
                }
                this.queryLeavel(val);
            },
            queryLeavel(id){//获取级别
                this.$axios({
                    method: 'POST',
                    url: '/leavel/queryCourseChoice',
                    data: {courseId: id}
                }).then(res => {
                    if (res) {
                        this.level = res.data;
                    }
                })
            },
            levelChange(val){//级别下拉框值改变事件   获取课时数据
                this.cleanTestType(2);
                this.chapter = [];
                if (!val || !this.isAll) {
                    return;
                }
                this.queryChapter(val);
            },
            queryChapter(val){//获取课时
                this.$axios({
                    method: 'POST',
                    url: '/chapter/getChapterByLevelId',
                    data: {levelId: val}
                }).then(res => {
                    if (res) {
                        this.chapter = res.data;
                    }
                })
            },
            // 每页显示的条数
            handleSizeChange(val) {
                // 改变每页显示的条数
                this.page.pageSize = val
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
                this.page.pageNo = 1
                // 点击每页显示的条数时，显示第一页
                this.getData()
            },
            //分页导航
            handleCurrentChange(val){
                //参数为当前页数
                this.page.pageNo = val;
                this.getData();
            },
            formatData(form){
                let obj = {...form};
                for (let item in obj) {
                    if (obj[item] == "") {
                        delete obj[item];
                    }
                }
                switch (obj['testType']) {
                    case 'languageTest':
                        obj.relevanceId = this.search.selectLanguage;
                        break;
                    case 'courseCertificate':
                        obj.relevanceId = this.search.selectCourse;
                        break;
                }
                return obj;
            },
            conditionalQuery(){
                this.importData = [];
                this.page.pageNo = 1;
                this.getData();
            },
            getData(){//获取数据
                //格式化参数
                let obj = this.formatData(this.query);
                this.$axios({
                    method: 'POST',
                    url: '/question/selectQuestion',
                    data: {
                        ...this.page,
                        ...obj
                    }
                }).then(res => {
                    this.tableData = res.data.data;
                    this.total = res.data.count;
                });
            }
        },
        components: {
            UpLoad
        },
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
    .red {
        color: #ff0000;
    }

    .el-upload {
        width: auto !important;
        height: auto !important;
        border: 0px;
        display: inline-block;
    }

    .info {
        display: block;
        resize: vertical;
        overflow: auto;
        padding: 5px 15px;
        line-height: 1.5;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
        height: 300px;
        font-size: 14px;
        color: #606266;
        background-color: #FFF;
        background-image: none;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    }
</style>