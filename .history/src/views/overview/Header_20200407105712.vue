<template>
    <div class="_nav_header">
        <div class="_header_inner">
            <div class="_inner_img">
                <div class="_img_police">
                    <img :src="logo">
                </div>
                <div class="_inner_header_time">
                <!--顶部时间-->
                <div class="col-md-5 fix-title-time" id="fix-title-time">
                  <div class="week-year">
                    <span class="week" id="week">{{week}}</span>
                    <div class="year" id="year">{{year}}</div>
                  </div>
                  <div id="time" class="fix-title-time-date time">{{time}}</div>
                </div>
              </div>
            </div>
            <div class="_inner_title">
                <div class="_inner_title_font">陕西交警总队集成指挥平台地图大数据
                </div>
            </div>
            <div class="_inner_btn">
              <div class="_btn_content" @click="gotoSys">进入系统>></div>
            </div>
        </div>
    </div>
</template>

<script>
    //import WeatherModule from './WeatherModule'
    export default {
        name: 'Header',
        props: {
            msg: String
        },
        created() {
            let that = this;
            setInterval(function () {
                that.initTime();
            }, 1000);
        },
        mounted() {
            let _this = this;
            _this.initTime();

        },
        data: function () {
            return {
                week: "",
                year: "",
                time: "",
                weather: {
                    status: "晴",
                    temperature: "7℃",
                    windy: "东南风2级"
                },
                logo:'./static/images/guohui.png'
            }
        },
        methods: {
            initTime() {
                let _this = this;
                let nowTime = new Date();
                var a = new Array("日", "一", "二", "三", "四", "五", "六");
                var week = new Date().getDay();
                _this.week = "周" + a[week];

                //取年月日
                var my_day = nowTime.getDate();
                var my_month = nowTime.getMonth() + 1;
                var my_year = nowTime.getFullYear();
                _this.year = my_year + "年" + my_month + "月" + my_day + "日";
                //取时分秒
                var d = new Date();
                var my_hours = d.getHours();
                var my_minutes = d.getMinutes();
                if (my_minutes < 10) {
                    my_minutes = "0" + my_minutes;
                }
                var my_seconds = d.getSeconds();
                if (my_seconds < 10) {
                    my_seconds = "0" + my_seconds;
                }
                _this.time = my_hours + ":" + my_minutes + ":" + my_seconds;

            },
            gotoSys(){
                this.$router.replace("/accident/monitor");
            }
        }
    }
</script>

<style scoped lang="scss">

    $percent100: 100%;

    @mixin flex($direction:row, $justify:center, $align:center) {
        display: flex;
        flex-direction: $direction;
        justify-content: $justify;
        align-items: $align;
    }
    @mixin _flex($direction:column, $justify:center, $align:center) {
        display: flex;
        flex-direction: $direction;
        justify-content: $justify;
        align-items: $align;
    }
    ._nav_header {
        width: $percent100;
        height: 8vh;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 11;
        //background: rgba(17, 32, 145, 1);
        color: #fff;
        background-color: #02030c;
        ._header_inner {
            width: 96%;
            height: $percent100;
            background-image: url("./image/title_back.png");
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
            margin: 0 auto;
            @include flex(row);

            ._inner_img {
                width: 20%;
                height: 100%;
                @include flex(row);

                ._img_police {
                    width: 12%;
                    height: 100%;
                    @include flex(row);

                    img {
                        width: auto;
                        height: auto;
                    }
                }
              ._inner_header_time {
    float: right;
    width: 75%;
    height: 100%;
    font-size: 1vw !important;
    margin-left: 5%;
                .fix-title-time {
                  width: 100%;
                  height: 80%;
                  margin-top:5%;
                  .week-year {
                    width: 100%;
                    height: 40%;
                    font-size: 1vw;
                    @include flex(row, flex-start);

                    .year {
                      width: 60%;
                      height: 100%;
                      @include flex(row, flex-start);
                    }

                    .week {
                      width: 20%;
                      height: 100%;
                      @include flex(row, flex-start);
                    }
                  }

                  .time {
                    width: 100%;
                    height: 50%;
                    font-size: 1.5vw !important;
                    @include flex(row, flex-start);
                  }
                }
              }
                ._img_content {
                    width: 80%;
                    height: 100%;
                    @include flex(row, flex-start);
                    font-size:1vw;
                }
            }

            ._inner_title {
                width: 70%;
                height: 100%;

                // background: orange;
                @include flex(row, center);

                ._inner_title_font {
                    width: $percent100;
                    height: $percent100;
                    color: white;
                    font-size: 1.8vw;
                    @include flex(column, center);
                }
            }
            ._inner_yq_statics{
                width: 23%;
                height: 100%;
                @include flex(row, center);
                &_tab{
                    width:25%;
                    height:100%;
                    color: rgb(87, 147, 243);
                    line-height: 10vh;
                    font-size: 1vw;
                    text-align: center;
                    span{
                        cursor:pointer;
                        display: inline-block;
                        color: #a5a5a5;
                    }
                    span.active{
                        color: white;
                    }
                }
                &_data{
                    width:75%;
                    height:100%;
                    margin-top: 10%;
                    &_item{
                        float:left;
                        width:21%;
                        height:50%;
                        @include _flex(column, center);
                        border: 1px solid #ccc;
                        margin: 0 5px;
                        ._header{
                            height:65%;
                            width:85%;
                            font-size: 0.85vw;
                            padding: 0 8%;
                            line-height: 3vh;
                            span{
                                display: inline-block;
                                float: right;
                            }
                        }
                        ._radio{
                            height:35%;
                            width:85%;
                            font-size: 0.65vw;
                            padding: 0 8%;
                            background-color: #cccccc;
                            color:black;
                            span{
                                display: inline-block;
                                float: right;
                            }
                        }
                    }
                    &_item:nth-child(1) ._header{
                        background-color: #d14b60;
                    }
                    &_item:nth-child(2) ._header{
                        background-color: #ffcc33;
                    }
                    &_item:nth-child(3) ._header{
                        background-color: #666666;
                    }
                    &_item:nth-child(4) ._header{
                        background-color: #33cc33;
                    }
                    &_item:nth-child(1) ._radio span{
                        color:red;
                    }
                    &_item:nth-child(2) ._radio span{
                        color:yellow;
                    }
                    &_item:nth-child(3) ._radio span{
                        color:black;
                    }
                    &_item:nth-child(4) ._radio span{
                        color:#33cc33;
                    }
                }
            }
            ._inner_btn {
                width: 18%;
                height: 100%;
                text-align: right;
                
               @include flex(row, center);
                ._btn_content {
                    width:6vw;
                    height:3vh;
                    float: right;
                    text-align: center;
                    line-height: 3vh;
                    background-color: #3a3c4c;
                    cursor: pointer;
                    @include flex(row, center);
                }
            }
        }
    }
</style>
