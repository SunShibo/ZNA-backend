<template>
    <!--在此处添加渲染的内容-->
    <div v-html="content" class="main">

    </div>
</template>

<script type="text/ecmascript-6">
    //将渲染的内容导出
    export default{
        props: {},
        data(){
            return {
                content: ''
            }
        },
        methods: {},
        components: {},
        computed: {},
        watch: {},
        created(){
            this.$axios({
                url: '/aboutUs/select',
                method: 'POST'
            }).then(res => {
                this.content = res.data.content;
            }).catch(err => {
                this.$message({
                    message: err.errMsg,
                    type: 'warning'
                });
            })
        },
        mounted(){
        },

    }
</script>

<style scoped>
    /**渲染内容的样式**/
    .main >>> img {
        width: 100%;
    }
    .main >>> iframe {
        display: block;
        width: 100%;
        /*margin: 0 auto;*/
    }

    .main >>> p {
        padding: 0 15px;
    }


</style>