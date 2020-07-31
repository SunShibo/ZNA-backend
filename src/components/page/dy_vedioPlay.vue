<template>
  <div class="error-page">
        <div  class="prism-player" id="J_prismPlayer"></div>
  </div>
</template>

<script>
  export default {
    
        data() {
            return {

               
            }
        },
        created() {
            this.getS();
        },
        computed: {
            
        },
        methods: {
            getS() {
                this.$axios
                    .post("/sequence/get")
                    .then(res => {
                        if(res.success){
                            this.play(res.data);
                        }
                    });
            },
            play(data){
                var player = new Aliplayer({
                id: 'J_prismPlayer',
                width: '100%',
                autoplay: true,
                
                //播放方式四：使用STS方式播放
                vid : this.$route.query.id,
                accessKeyId: data.akId,
                securityToken: data.stk,
                accessKeySecret: data.akScret,
                region:'cn-shanghai',//eu-central-1,ap-southeast-1
                },function(player){
                    console.log('播放器创建好了。')
            });
            }
            
        }
    }
</script>


<style scoped>
    .error-page{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: #f3f3f3;
        box-sizing: border-box;
    }
    
</style>
