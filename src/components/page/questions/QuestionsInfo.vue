<template>
    <!--在此处添加渲染的内容-->
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 题库管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">

                <!--上传图片-->
                <UpLoad
                        v-show="false"
                        idName="uploadImage"
                        :onUpLoadSuccess="handleOnSuccess"
                        :onUpLoadBeforeUpload="beforeUpload"
                        :onUpLoadError="onUpLoadError"
                        :multiple="false"
                        videoType="questions"
                        :drag="false"
                        :fileList="fileList"
                        :isClear="true"
                        accept="image/*"
                        refUpLoad="uploadImage"
                        listType="picture"></UpLoad>
                <!--上传音频-->
                <UpLoad
                        v-show="false"
                        idName="uploadAudio"
                        :onUpLoadSuccess="handleOnSuccess"
                        :onUpLoadBeforeUpload="beforeUpload"
                        :onUpLoadError="onUpLoadError"
                        :multiple="false"
                        videoType="questions"
                        :drag="false"
                        :isClear="true"
                        :fileList="audioList"
                        accept="audio/*"
                        refUpLoad="uploadAudio"
                        listType="picture"></UpLoad>
                <el-form :model="form" label-position="right" label-width="120px" :rules="rules" ref="questionsForm"
                         class="demo-form-inline">
                    <el-form-item label="试题类型" prop="questionType">
                        <el-select @change="questionTypeChange" v-model="form.questionType" placeholder="请选择试题类型">
                            <el-option
                                    v-for="item in questionType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <span class="red" style="margin-left: 10px">请先选择试题类型</span>
                    </el-form-item>
                    <el-form-item label="试题分类" prop="testType">
                        <div class="inline-black-show">
                            <el-select @change="testTypeChange" v-model="form.testType" placeholder="请选择试题分类">
                                <el-option
                                        v-for="item in testType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="inline-black-show" v-show="isLanguage||isLanguageAndCourse||isAll">
                            <el-select v-model="selectData.selectLanguage"
                                       @change="languageChange" filterable
                                       placeholder="请选择语言">
                                <el-option
                                        v-for="item in language"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="inline-black-show" v-show="isLanguageAndCourse||isAll">
                            <el-select v-model="selectData.selectCourse"
                                       @change="courseChange" filterable
                                       placeholder="请选择课程">
                                <el-option
                                        v-for="item in course"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="inline-black-show" v-show="isAll">
                            <el-select v-model="selectData.selectLevel" @change="levelChange" filterable
                                       placeholder="请选择级别">
                                <el-option
                                        v-for="item in level"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="inline-black-show" v-show="isAll">
                            <el-select v-model="form.relevanceId" filterable placeholder="请选择课时">
                                <el-option
                                        v-for="item in chapter"
                                        :key="item.id"
                                        :label="item.chapterName"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </el-form-item>


                    <el-form-item label="文章内容" v-if="form.questionType=='read'"
                                  prop="article"
                                  :rules="[{required: true, message: '文章内容不能为空', trigger: 'blur'}]">
                        <el-input
                                type="textarea"
                                :autosize="{minRows: 2}"
                                placeholder="请输入文章内容"
                                v-model="form.article">
                        </el-input>
                    </el-form-item>

                    <!--题目-->
                    <div v-if="form.questionType=='read'"
                         class="read-item"
                         v-for="(topic,index) in form.readingComprehension"
                         :key="'readTopic'+index">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item
                                        :label="'第'+(index+1)+'题题目'"
                                        :prop="'readingComprehension.'+index+'.value'"
                                        :rules="{required: true, message: '题目不能为空', trigger: 'blur'}">
                                    <el-input v-model="topic.value" placeholder="请输入题目" type="text"
                                              style="width: 250px;"></el-input>
                                    <div class="btn-group">
                                        <el-button v-show="index==form.readingComprehension.length-1"
                                                   @click.prevent="addTopicDom(index)" type="success" plain>添加题目
                                        </el-button>
                                        <el-button type="danger" v-show="form.readingComprehension.length!=1"
                                                   @click.prevent="removeReadingComprehensionDom(index)"
                                                   icon="el-icon-delete" plain></el-button>
                                    </div>

                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="12">
                                <el-form-item
                                        v-for="(option,optionIndex) in topic.readOptions"
                                        :key="'readOption'+optionIndex"
                                        :label="optionIndex==0?'第'+(index+1)+'题选项':''"
                                        :prop="'readingComprehension.'+index+'.value'"
                                        :rules="{required: true, message: '题目不能为空', trigger: 'blur'}">
                                    <el-input v-model="option.value" placeholder="请输入选项" type="text"
                                              style="width: 250px;margin: 5px 0;"></el-input>
                                    <div class="btn-group">
                                        <el-button v-show="optionIndex==topic.readOptions.length-1"
                                                   @click.prevent="addOptionDom(index)" type="success" plain>添加选项
                                        </el-button>
                                        <el-button type="danger" v-show="topic.readOptions.length!=1"
                                                   @click.prevent="removeReadDom(index,optionIndex)"
                                                   icon="el-icon-delete" plain></el-button>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item :label="'第'+(index+1)+'题答案'">
                                    <el-select v-model="topic.answer" filterable placeholder="请选择答案" focus="onFocus">
                                        <el-option
                                                v-for="(optionItem,optionIndex) in topic.readOptions"
                                                :key="'readAnswer'+optionIndex"
                                                :label="optionItem.value?optionItem.value:'无'"
                                                :value="optionIndex">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item
                                        :label="'第'+(index+1)+'题解析'"
                                        :prop="'readingComprehension.'+index+'.analysis'"
                                        :rules="{required: true, message: '解析不能为空', trigger: 'blur'}">
                                    <el-input
                                            style="width: 250px;"
                                            type="textarea"
                                            :autosize="{minRows: 4}"
                                            placeholder="请输入解析"
                                            v-model="topic.analysis">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item :label="'第'+(topic.id+1)+'题分值'"
                                              :prop="'readingComprehension.'+index+'.score'"
                                              :rules="{required: true, message: '解析不能为空', trigger: 'blur'}">
                                    <el-input v-model="topic.score" type="number" placeholder="请输入分值"
                                              style="width: 250px;"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <el-form-item
                            v-else
                            v-for="(topic,index) in form.topics"
                            :label="'题目第'+(index+1)+'行'"
                            :key="'topic'+index"
                            :prop="'topics.'+index+'.value'"
                            :rules="{required: true, message: '题目不能为空', trigger: 'blur'}">
                        <el-input v-model="topic.value" placeholder="请输入题目" type="text"
                                  style="width: 250px;"></el-input>
                        <div class="btn-group">
                            <el-button v-show="index==form.topics.length-1"
                                       @click.prevent="addDom(index,'topics')" type="success" plain>添加题目
                            </el-button>
                            <el-button type="primary"
                                       v-show="topic.isUpload"
                                       @click.prevent="showTopic(index)" plain>查看
                            </el-button>
                            <el-button type="primary"
                                       v-show="(form.questionType!='follow'&&form.questionType!='hearingAndTest'&&form.questionType!='hearingAndSentence'&&form.questionType!='imageText')||((form.questionType=='follow'||form.questionType=='hearingAndTest'||form.questionType=='hearingAndSentence'||form.questionType=='imageText')&&index>1)"
                                       @click.prevent="addTopics(index,0)" plain>上传图片
                            </el-button>
                            <el-button type="primary"
                                       v-show="index==1&&(form.questionType=='follow'||form.questionType=='hearingAndTest'||form.questionType=='hearingAndSentence')"
                                       @click.prevent="addTopics(index,2)" plain>上传音频
                            </el-button>
                            <el-button type="danger" v-show="form.topics.length!=1"
                                       @click.prevent="removeDom('topics',topic)" icon="el-icon-delete"
                                       plain></el-button>
                        </div>
                    </el-form-item>


                    <!--选项-->
                    <!--图文匹配题-->
                    <el-form-item
                            v-if="form.questionType=='imageText'"
                            v-for="(option,optionIndex) in form.options"
                            :label="'选项第'+(optionIndex+1)+'项'"
                            :key="'imageTextOption'+optionIndex"
                            :prop="'options.'+optionIndex+'.value'"
                            :rules="{required: true, message: '选项不能为空', trigger: 'blur'}">
                        <UpLoad
                                :class="{'hide':option.hideUpload, 'upload-item':true}"
                                :idName="'uploadImage'+optionIndex"
                                :onSuccess="handleImageAndTextSuccess"
                                :onUpLoadBeforeUpload="beforeUpload"
                                :onUpLoadSuccess="handleSuccess"
                                :onUpLoadError="onUpLoadError"
                                :onUpLoadPreView="handlePictureCardPreview"
                                :onUpLoadRemove="onRemove"
                                :multiple="false"
                                videoType="questions"
                                :drag="false"
                                :fileList="option.imageText"
                                accept="image/*"
                                :refUpLoad="'uploadImage'+optionIndex"
                                listType="picture-card"></UpLoad>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                        <div class="btn-group">
                            <el-button v-show="optionIndex==form.options.length-1"
                                       @click.prevent="addDom(optionIndex,'options')" type="success" plain>添加选项
                            </el-button>
                            <el-button type="danger" v-show="form.options.length!=1"
                                       @click.prevent="removeDom('options',option)" icon="el-icon-delete"
                                       plain></el-button>
                        </div>
                    </el-form-item>

                    <!--选择题-->
                    <el-form-item
                            v-if="form.questionType!='follow'&&form.questionType!='read'&&form.questionType!='imageText'"
                            v-for="(option,optionIndex) in form.options"
                            :label="'选项第'+(optionIndex+1)+'项'"
                            :key="'option'+optionIndex"
                            :prop="'options.'+optionIndex+'.value'"
                            :rules="{required: true, message: '选项不能为空', trigger: 'blur'}">
                        <el-input v-model="option.value" placeholder="请输入选项" type="text"
                                  style="width: 250px;"></el-input>
                        <div class="btn-group">
                            <el-button v-show="optionIndex==form.options.length-1"
                                       @click.prevent="addDom(optionIndex,'options')" type="success" plain>添加选项
                            </el-button>
                            <el-button type="danger" v-show="form.options.length!=1"
                                       @click.prevent="removeDom('options',option)" icon="el-icon-delete"
                                       plain></el-button>
                        </div>
                    </el-form-item>


                    <!--除去听音完成句子、拼写题和阅读理解题的答案-->
                    <el-form-item
                            v-if="form.questionType!='hearingAndSentence'&&form.questionType!='follow'&&form.questionType!='read'&&form.questionType!='write'&&form.questionType!='imageText'"
                            label="答案" prop="answer">
                        <el-select v-model="form.answer" filterable placeholder="请选择答案">
                            <el-option
                                    v-for="(optionItem,optionIndex) in form.options"
                                    v-if="form.options.length!=1"
                                    :key="'answer'+optionIndex"
                                    :label="optionItem.value"
                                    :value="optionIndex">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!--拼写题和听音完成句子的答案-->
                    <el-form-item
                            v-if="form.questionType!='follow'&&(form.questionType=='write'||form.questionType=='hearingAndSentence')"
                            label="答案"
                            prop="writeAnswer"
                            :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                        <el-select v-model="form.writeAnswer" multiple placeholder="请选择拼写题答案"
                                   @change="answerChange">
                            <el-option
                                    v-for="(optionItem,optionIndex) in form.options"
                                    v-if="form.options.length!=1"
                                    :key="'writeAnswer'+optionIndex"
                                    :label="optionItem.value"
                                    :value="optionIndex">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="form.questionType!='follow'&&form.questionType=='imageText'" label="答案"
                                  prop="answer">
                        <el-select v-model="form.answer" filterable placeholder="请选择图文匹配题答案">
                            <el-option
                                    v-for="(optionItem,optionIndex) in form.options"
                                    v-if="form.options.length!=1"
                                    :key="'answer'+optionIndex"
                                    :label="'第'+(optionIndex+1)+'选项'"
                                    :value="optionIndex">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!--解析-->
                    <el-form-item v-if="form.questionType!='follow'&&form.questionType!='read'" label="解析"
                                  prop="analysis">
                        <el-input
                                style="width: 250px;"
                                type="textarea"
                                :autosize="{minRows: 4}"
                                placeholder="请输入解析"
                                v-model="form.analysis">
                        </el-input>
                    </el-form-item>

                    <!--分值-->
                    <el-form-item v-if="form.questionType!='read'" label="分值" prop="score">
                        <el-input v-model="form.score" :disabled="scoreDisabled" type="number" placeholder="请输入分值"
                                  style="width: 250px;"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="search" @click="onSubmit('questionsForm')">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import UpLoad from '../../common/Upload.vue';

    //将渲染的内容导出
    export default{
        name: 'QuestionsInfo',
        props: {},
        inject: ['reload'],
        data(){
            return {

                id: 0, //编辑跳转的ID
                preData: {}, //从编辑跳转 查询出的数据

                scoreDisabled: false,//用于控制分数是否禁用

                //-------elementUi中上传组件返回的fileList数组
                fileList: [],//用于获取上传图片的数据
                audioList: [],//用于获取上传语音的数据

                dialogImageUrl: '',//图文匹配题放大图片的地址
                dialogVisible: false,//图文匹配题的弹出层显示状态
                imageIndex: 0,//图文匹配题中添加图片的下标
                currentIndex: 0,//当前上传视频或图片的题目下标
                status: 'success',//进度条状态
                form: {//表单数据
                    questionType: '',//试题题型
                    testType: '',//试题分类
                    topics: [{//除去阅读理解题的题目
                        id: 0,//id为题目的当前下标
                        value: '',
                        isUpload: false//判断上传，且是否上传成功
                    }],
                    options: [{//除去阅读理解题的选项
                        id: 0,
                        value: '',
                        hideUpload: false,//用来判断图文匹配题是否已上传图片
                        imageText: []//图文匹配题的数组
                    }],
                    readingComprehension: [{//阅读理解题
                        id: 0,
                        value: '',//阅读理解题题目
                        score: '',//阅读理解题分值
                        answer: '',//阅读理解答案
                        analysis: '',//阅读理解题解析
                        readOptions: [{//阅读理解题的选项
                            id: 0,
                            value: ''
                        }],
                    }],
                    article: '',//阅读理解的文章内容

                    //关联ID
                    //当testType选项为 languageTest 时 关联ID为语言ID
                    //当testType选项为 courseCertificate 时 关联ID为课程ID
                    //当testType选项为 warmUp 或 test 时 关联ID为课时ID
                    relevanceId: '',
                    //单选题分值
                    score: '',
                    //单选题解析
                    analysis: '',
                    //单选题答案
                    answer: '',
                    //拼写题和听音完成句子答案
                    writeAnswer: []
                },
//                readTopicsIndex: 1,//当前选项时第几题
                rules: {//验证
                    questionType: [
                        {required: true, message: '试题类型不能为空', trigger: 'change,blur'}
                    ],
                    testType: [
                        {required: true, message: '试题分类不能为空', trigger: 'change,blur'}
                    ],
                    score: [
                        {required: true, message: '试题分值不能为空', trigger: 'blur'}
                    ],
                    answer: [
                        {required: true, message: '试题答案不能为空', trigger: 'blur'}
                    ],
                    analysis: [
                        {required: true, message: '试题解析不能为空', trigger: 'blur'}
                    ]
                },
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
                isLanguage: false,//控制语言显示
                isLanguageAndCourse: false,//控制语言、课程显示
                isAll: false,//控制语言、课程、级别、课时显示
                selectData: {
                    selectLanguage: '',//选中的语言数据
                    selectCourse: '',//选中的课程数据
                    selectLevel: ''//选中的级别数据
                },
                loading: {},   //蒙层对象
            }
        },
        methods: {

            onUpLoadError(err){//上传Error
                console.error(err);
                this.$message.success('上传失败，请重新上传！');
            },
            answerChange(val){
                this.writeAnswer = val;
            },
            cleanTestType(val){
                val > 4 ? this.selectData.selectLanguage = '' : '';//清空语言数据
                val > 3 ? this.selectData.selectCourse = '' : '';//清空课程数据
                val > 2 ? this.selectData.selectLevel = '' : '';//清空级别数据
                val > 1 ? this.form.relevanceId = '' : '';//清空课时数据
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
            handleExceed(files, fileList){//文件超出个数限制时的钩子
                if (fileList.length > 1) {
                    this.$message.error('选项中只能存在一张图片！');
                }
            },
            onRemove(file, fileList){//删除列表图片的事件
                //获取下标  将值改变
                this.$nextTick(function () {
                    let itemDom = document.querySelectorAll('.el-upload-list__item-thumbnail');
                    for (let i = 0, len = itemDom.length; i < len; i++) {
                        if (itemDom[i].src == file.url) {
                            this.form.options[i].hideUpload = false;
                        }
                    }
                })
            },

            handleSuccess(response, file){//组件的回调
                this.$message.success('上传成功！');
            },
            handleImageAndTextSuccess(response, file){//图文匹配题选项图片上传成功后
                //获取下标  将值改变
                this.$nextTick(function () {
                    let itemDom = document.querySelectorAll('.el-upload-list__item-thumbnail');
                    for (let i = 0, len = itemDom.length; i < len; i++) {
                        if (itemDom[i].src == file.url) {
                            this.$set(this.form.options[i], 'hideUpload', true);
                            this.$set(this.form.options[i], 'value', response);
                        }
                    }
                })
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
            handleOnSuccess(response, file){//音频、视频、图片上传完成后
                this.form.topics[this.currentIndex].value = response;
                this.form.topics[this.currentIndex].isUpload = true;
                this.loading.close();
                this.$message.success('上传成功！');
            },
            questionTypeChange(val){//试题类型Change事件
                //根据对应的题型，显示不同的状态
                this.form.questionType = val;
            },
            showTopic(index){//查看按钮  跳转查看视频 图片 音频
                window.open(this.form.topics[index].value, '_blank');
            },
            addTopics(index, state){//添加图片或视频
                this.currentIndex = index;
                if (state) {//上传音频
                    if (Object.keys(this.audioList).length) {
                        this.$refs.uploadAudio.clearFiles();
                    }
                    document.querySelector('#uploadAudio input').click(); //触发点击事件
                } else { //上传图片
                    if (Object.keys(this.fileList).length) {
                        this.$refs.uploadImage.clearFiles();
                    }
                    document.querySelector('#uploadImage input').click();
                }
            },
            addDom(index, key) {//增加Dom
                if (this.form.questionType == 'judge' && this.form.options.length >= 2) {
                    this.$message.error('判断题只有两个选项！');
                    return;
                }
                if (Object.is(key, 'topics')) {//添加题目
                    this.form[key].push({
                        id: index + 1,
                        value: '',
                        isUpload: false
                    });
                } else {//添加选项
                    this.form[key].push({
                        id: index + 1,
                        value: '',
                        hideUpload: false
                    });
                }
            },
            removeDom(key, item) {//删除Dom
                let index = this.form[key].indexOf(item);
                if (index !== -1) {
                    this.form[key].splice(index, 1)
                }
            },

            //阅读题
            addTopicDom(index){
                this.form.readingComprehension.push({
                    id: index + 1,
                    value: '',
                    score: '',
                    analysis: '',
                    readOptions: [{//阅读理解题的选项
                        id: index + 1,
                        value: ''
                    }]
                });
            },
            addOptionDom(index) {//增加Dom  index为题目下标
                this.form.readingComprehension[index].readOptions.push({
                    id: index,
                    value: '',
                    hideUpload: false,//用来判断图文匹配题是否已上传图片
                    imageText: []//图文匹配题的数组
                });
            },
            removeReadingComprehensionDom(index){//删除题目
                let topicsId = 0, topicsIndex = 0, id = this.form.readingComprehension[index].id;
                for (let i = 0, len = this.form.readingComprehension.length; i < len; i++) {
                    //先去获取题目的ID以及下标，固化下来
                    if (id == this.form.readingComprehension[i].id) {
                        topicsIndex = i;
                        topicsId = this.form.readingComprehension[i].id;
                    }
                    //修改当前下标以后的题目ID
                    if (id < this.form.readingComprehension[i].id) {
                        this.form.readingComprehension[i].id--;
                    }
                    //再去修改该题目ID之后的选项ID
                    for (let j = 0, lenJ = this.form.readingComprehension[i].readOptions.length; j < lenJ; j++) {
                        if (topicsId < this.form.readingComprehension[i].readOptions[j].id) {
                            this.form.readingComprehension[i].readOptions[j].id--;
                        }
                    }
                }
                this.form.readingComprehension.splice(topicsIndex, 1);
//                this.readTopicsIndex--;
            },
            removeReadDom(readIndex, optionIndex) {//删除Dom
                if (this.form.readingComprehension[readIndex].readOptions.length < 2) {
                    this.$message.error('题目不能没有选项！');
                    return;
                }
                //直接删除
                this.form.readingComprehension[readIndex].readOptions.splice(optionIndex, 1);
            },
            addFormatForm(form){//添加格式化请求数据
                let formData = {
                    topic: '',
                    option: '',
                    answer: '',
                    score: '',
                    relevanceId: 0,
                    questionType: '',
                    testType: ''
                };


                if (Object.is(form.questionType, 'read')) {//阅读理解题的格式化方式


                    let topic = [form.article], score = [], option = [], answer = [];
                    for (let i = 0, len = form.readingComprehension.length; i < len; i++) {
                        //阅读理解题的题目
                        topic.push(form.readingComprehension[i].value);
                        //阅读理解题的分值
                        score.push(parseInt(form.readingComprehension[i].score));
                        //获取阅读理解题的选项
                        let arr = [], readOptions = form.readingComprehension[i].readOptions;
                        for (let j = 0, lenJ = readOptions.length; j < lenJ; j++) {
                            arr.push(readOptions[j].value);
                        }
                        option.push(arr);
                        answer.push({
                            ans: form.readingComprehension[i].answer,
                            des: form.readingComprehension[i].analysis
                        })
                    }
                    formData.topic = JSON.stringify(topic);
                    formData.score = JSON.stringify(score);
                    formData.option = JSON.stringify(option);
                    formData.answer = JSON.stringify(answer);


                    //格式化试题题型  分类
                    switch (form.testType) {
                        case 'languageTest':
                            formData.relevanceId = this.selectData.selectLanguage;
                            break;
                        case 'courseCertificate':
                            formData.relevanceId = this.selectData.selectCourse;
                            break;
                        default:
                            formData.relevanceId = form.relevanceId;
                            break;
                    }
                    formData.questionType = form.questionType;
                    formData.testType = form.testType;


                } else {//除去阅读理解题的格式化方式


                    //如果题型等于听音完成句子题或听音跟读或听力和文本匹配题  就将第二个元素改成第一个元素
                    if (Object.is(form.questionType, 'hearingAndSentence') || Object.is(form.questionType, 'follow') || Object.is(form.questionType, 'hearingAndTest')) {
                        //判断第二个元素是否是MP3
                        if (form.topics[1].value.indexOf('https') != -1) {
                            //利用结构赋值 和 剩余操作符，将数组位置调换
                            let [a, b, ...arr] = this.formatArray(form.topics);
                            formData.topic = JSON.stringify([b, a, ...arr]);
                        }
                    } else {
                        //格式化题目   选项    答案   分数  关联ID   试题类型  试题分类
                        formData.topic = JSON.stringify(this.formatArray(form.topics));
                    }
                    //格式化选项
                    formData.option = JSON.stringify([this.formatArray(form.options)]);
                    //将答案和解析合并到一起
                    //如果题型等于拼写题，将数组答案join后保存
                    formData.answer = form.questionType == 'write' || form.questionType == 'hearingAndSentence' ? JSON.stringify([{
                            ans: form.writeAnswer.join(','),
                            des: form.analysis
                        }]) : JSON.stringify([{ans: form.answer, des: form.analysis}]);
                    //判断是否是听音跟读题
                    if (Object.is(form.questionType, 'follow')) {
                        formData.score = JSON.stringify([0]);
                    } else {
                        formData.score = JSON.stringify([form.score]);
                    }
                    //试题分类
                    switch (form.testType) {
                        case 'languageTest':
                            formData.relevanceId = this.selectData.selectLanguage;
                            break;
                        case 'courseCertificate':
                            formData.relevanceId = this.selectData.selectCourse;
                            break;
                        default:
                            formData.relevanceId = form.relevanceId;
                            break;
                    }
                    formData.questionType = form.questionType;
                    formData.testType = form.testType;


                }

                return formData;
            },
            formatArray(arr){//将数组格式化成正确的参数方式
                let formData = [];
                for (let i = 0, len = arr.length; i < len; i++) {
                    formData.push(arr[i].value);
                }
                return formData;
            },
            onSubmit(formName){//提交表单
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let formData = this.addFormatForm(this.form);
                        if (this.id) {
                            this.$axios({
                                method: 'POST',
                                url: '/question/updateQuestion',
                                data: {
                                    ...formData,
                                    id: this.id
                                }
                            }).then(res => {
                                if (res) {
                                    this.$message.success(res.data);
                                    this.getPreData();
                                }
                            })
                        } else {
                            this.$axios({
                                method: 'POST',
                                url: '/question/addQuestion',
                                data: {
                                    ...formData
                                }
                            }).then(res => {
                                if (res) {
                                    this.$message.success(res.data);
                                    //刷新
                                    this.reload();
                                }
                            })
                        }
                    } else {
                        console.error('error submit!!');
                        return false;
                    }
                });
            },
            getEditReadArray(topic, options, answer, score){//格式化题目
                let arrData = [], option = [];
                //阅读理解题传入options，answer  score

                //获取格式化的选项
                for (let i = 0, len = options.length; i < len; i++) {
                    let arr = [];
                    for (let j = 0, lenJ = options[i].length; j < lenJ; j++) {
                        arr.push({
                            id: i,
                            value: options[i][j],
                        });
                    }
                    option.push(arr);
                }

                //格式化成可以显示的对象数组
                for (let i = 0, len = topic.length; i < len; i++) {
                    if (!i) {
                        this.$set(this.form, 'article', topic[i]);
                        continue;
                    }
                    arrData.push({
                        id: (i - 1),
                        value: topic[i],
                        readOptions: option[i - 1],
                        score: score[i - 1],
                        answer: answer[i - 1].ans,
                        analysis: answer[i - 1].des
                    })
                }
                return arrData;
            },
            getEditTopicArray(topic){//非阅读理解题的题目格式化
                let arrData = [];
                for (let i = 0, len = topic.length; i < len; i++) {
                    arrData.push({id: i, value: topic[i], key: Date.now() + Math.random(), isUpload: false});
                }
                return arrData;
            },
            getEditImageFileList(option){//格式化图文匹配题的选项
                let arrData = [];
                for (let i = 0, len = option[0].length; i < len; i++) {
                    arrData.push({
                        id: (i + 1),
                        value: option[0][i],
                        hideUpload: true,
                        imageText: [{url: option[0][i], name: option[0][i]}]
                    })
                }
                return arrData;
            },
            getEditOptionArray(option){//非阅读理解题的选项格式化
                let arrData = [];
                for (let i = 0, len = option[0].length; i < len; i++) {
                    arrData.push({id: i, value: option[0][i], key: Date.now() + Math.random() + i})
                }
                return arrData;
            },
            getEditAnswer(answer){//多选题  （拼写和听音完成句子）数据格式化  传入数组
                let newAnswer = [];
                for (let item in answer) {
                    newAnswer.push(parseInt(item));
                }
                return newAnswer;
            },
            editDisplay(idObject){//编辑回显 将数据绑定到组件上
                //获取试题题型
                this.$set(this.form, 'questionType', this.preData.questionType);
                //获取试题分类
                this.$set(this.form, 'testType', this.preData.testType);

                //根据试题分类显示语言、课程、级别、课时
                this.dynamicSettingSelect(this.form.testType);

                //获取数据 并赋值
                this.queryCourse(idObject.languageId);
                this.queryLeavel(idObject.courseId);
                this.queryChapter(idObject.levelId);
                this.selectData.selectLanguage = idObject.languageId;
                this.selectData.selectCourse = idObject.courseId;
                this.selectData.selectLevel = idObject.levelId;
                this.form.relevanceId = idObject.chapterId;


                if (Object.is(this.form.questionType, 'read')) {//阅读理解题
                    //单独格式化阅读理解题
                    this.form.readingComprehension = this.getEditReadArray(JSON.parse(this.preData.topic),
                        JSON.parse(this.preData.option),
                        JSON.parse(this.preData.answer),
                        JSON.parse(this.preData.score));

                } else {//非阅读理解题

                    this.form.topics = this.getEditTopicArray(JSON.parse(this.preData.topic));
                    //如果题型等于听音完成句子题  就将第二个元素改成第一个元素
                    if (Object.is(this.form.questionType, 'hearingAndSentence') || Object.is(this.form.questionType, 'follow') || Object.is(this.form.questionType, 'hearingAndTest')) {

                        //利用结构赋值 和 剩余操作符，将数组位置调换
                        let [a, b, ...arr] = this.form.topics;
                        //判断第二道题是否是mp3
                        if (this.form.topics[0].value.indexOf('https') != -1) {
                            this.form.topics = [b, a, ...arr];
                            a.isUpload = true;
                        }else {
                            b.isUpload = true;
                        }
                    }
                    //判断是否是图文匹配题  图文匹配题的格式和其他题型不一样，所以需要单独格式化
                    if (Object.is(this.preData.questionType, 'imageText')) {
                        this.form.options = this.getEditImageFileList(JSON.parse(this.preData.option))
                    } else if (this.preData.questionType !== 'follow') {//除去听音跟读题的回显
                        this.form.options = this.getEditOptionArray(JSON.parse(this.preData.option));
                        //多选题答案回显
                        if (this.preData.questionType === 'write' || this.preData.questionType === 'hearingAndSentence') {
                            this.form.writeAnswer = this.getEditAnswer(JSON.parse(this.preData.answer)[0].ans.split(','));
                        } else {//单选题答案
                            this.form.answer = JSON.parse(this.preData.answer)[0].ans;
                        }
                        //格式化解析
                        this.form.analysis = JSON.parse(this.preData.answer)[0].des;
                        //除去听音跟读题的分数回显
                        this.form.score = JSON.parse(this.preData.score)[0];

                    } else if (this.preData.questionType === 'follow') {//听音跟读没有分数
                        this.form.score = 0;
                    }

                }
            },
            getPreData(){//编辑回显获取数据
                this.$axios({
                    method: 'POST',
                    url: '/question/getQuestionById',
                    data: {id: this.id}
                }).then(res => {
                    if (res) {
                        this.preData = res.data.question;
                        this.editDisplay(res.data.idBO);
                    } else {
                        this.$message.error(res.errMsg);
                    }
                })
            }
        },
        components: {
            UpLoad
        },
        computed: {},
        created(){
            this.id = this.$route.query.id;
            if (this.id) {
                this.getPreData()
            }
        },
        watch: {
            '$route':function (newData, oldData) {
                this.id = newData.query.id;
                if (this.id) {
                    this.getPreData()
                }
            }
        },
        mounted(){
        },

    }
</script>

<style scoped>
    /**渲染内容的样式**/

    .btn-group {
        margin-left: 20px;
        display: inline-block;
    }

    .red {
        color: #ff0000;
    }

    .inline-black-show {
        display: inline-block;
        margin-right: 10px;
    }

    .progress {
        position: fixed;
        z-index: 9999;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .read-item {
        border-bottom: 1px solid #e4e4e4;
        margin-bottom: 10px;
        padding: 10px 0 0;
    }

    .upload-item {
        display: inline-block
    }

</style>