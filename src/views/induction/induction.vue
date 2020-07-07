<template>
  <div class='induction'>
      <img :src="img" alt="">
  </div>
</template>

<script>
// import { IMG } from "./config";
import {interf} from "./config";
export default {
    name:'induction',
    data(){
        return{
            img:'',
            timer:null,
        }
    },
    mounted(){
        this.getDiagramData()
        this.map = this.$store.state.map;
        let that=this;
        this.map.setCenter([109.278987,35.747334]);
        that.timer=setInterval(() => {
            this.getDiagramData()
        },1000*60);
    },
    destroyed(){
        if(this.timer){
        clearInterval(this.timer)
        }
    },
    methods:{
        getDiagramData(){
            let that=this;
            interf.GET_DIAGRAM_API({}).then(response=>{
                if (response && response.status == 200){
                let data= response.data;
                // if (data.errcode == 0) {
                 that.img=urlConf.JT_PATH+response.data+'/cn/1920x1080/0029_501_001.png';
                // }else{
                //     that.$message({
                //     message: data.errmsg,
                //     type: "error",
                //     duration: 1500
                //     });
                // }
                }
            })
            .catch(err=>{
                console.log(err);
            })
            .finally(() => {
                that.tableLoading = false;
             });
        },
        // getimg(){
        //     this.$axios.get('http://map.xianjiaojing.com/traffic_xian//induce/getDiagram?tokens=013a900e-7b32-4b20-9cb1-37dd1dfbb971&t=1589873301077'
        //     // ,{
        //     // params:{
        //     //     t:1589873301077
        //     // }
        //     // }
        // )
        // .then(res=>{
        //     console.log(res.data.data)
        //     this.img=res.data.data.diagramUrl
        // })
        // .catch(err=>{
        //     console.log(err)
        // })
        
        // } 
        
    }

}
</script>

<style scoped lang='scss'>
.induction{
    width:100%;
    height:859px;
    background-color: #0a124a;
    img{
        width:100%;
        height:100%;
    }
}
</style>