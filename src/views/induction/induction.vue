<template>
  <div >
      <img :src="img" alt="">
  </div>
</template>

<script>
// import { IMG } from "./config";
// import { interf } from "./config";
export default {
    name:'induction',
    data(){
        return{

        }
    },
    mounted(){
        // this.getDiagramData()
        let timer=setInterval(() => {
            // this.getDiagramData()
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
                var data= response.data;
                if (data.errcode == 0) {
                 that.img=res.data.data.diagramUrl;
                }else{
                    that.$message({
                    message: data.errmsg,
                    type: "error",
                    duration: 1500
                    });
                }
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

<style>

</style>