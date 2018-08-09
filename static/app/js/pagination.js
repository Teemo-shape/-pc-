 //分页
    var param={};
    function page(nowPage,pageShow,totalNum){
        totalPage = Math.ceil(totalNum/pageShow);
        param.nowPage = nowPage;
        param.pageShow = pageShow;
        param.totalNum = totalNum;
        param.totalPage = totalPage;
        html = "";
        if(totalPage<8){
            html += '<button class="prev" ';
            if(nowPage == 1){
                html += 'disabled';
            }   
            html += ' style="background:#fff"><</button>';

            for(var i = 1;i <= totalPage ;i++){
                html += '<span class="item ';
                if(nowPage == i){
                    html += 'active';
                }
                html +='" title="第'+i+'页">'+i+'</span>';
            }

            html += '<button class="next" ';
            if(nowPage == totalPage){
                html += 'disabled';
            }
            html += ' style="background:#fff">></button>';

            $(".padding-box .clearmar").html(html);
        }else{
            if(totalPage >= 8 && nowPage < 7){
                html += '<button class="prev" ';
                if(nowPage == 1){
                    html += 'disabled';
                }   
                html += ' style="background:#fff"><</button>';

                for(var i = 1; i <= 7 ;i++){
                    html += '<span class="item ';
                    if(nowPage == i){
                        html += 'active';
                    }
                    html +='" title="第'+i+'页">'+i+'</span>';
                }

                html += '<button class="next" ';
                if(nowPage == totalPage){
                    html += 'disabled';
                }
                html += ' style="background:#fff">></button>';

                $(".padding-box .clearmar").html(html);
            }else{
                html += '<button class="prev" ';
                if(nowPage == 1){
                    html += 'disabled';
                }
                html += ' style="background:#fff"><</button>';

                html += '<span class="item" title="第1页">1</span>';
                html += '<span class="item" title="第2页">2</span>';
                html += '<span class="item" title="第3页">3</span>';
                html += '<span class="item" title="第...页">...</span>';
                var before = nowPage - 1;   
                var after = nowPage + 1;  
                html += '<span class="item" title="第'+ before +'页">'+before+'</span>';       
                        
                        
                        
                if(nowPage <= totalPage){
                    html += '<span class="item active" title="第'+ nowPage +'页">'+nowPage+'</span>';
                }
                if(nowPage+1<=totalPage){
                    html += '<span class="item" title="第'+ after +'页">'+after+'</span>';
                            
                }
                        

                html += '<button class="next" ';
                if(nowPage == totalPage){
                    html += 'disabled';
                }   
                html += ' style="background:#fff">></button>';    
                $(".padding-box .clearmar").html(html);
            }

        }
        
    }



    $(".padding-box .clearmar").on("click","span:gt(0),span:lt(8)",function(){
            nowPage = $(this).html();
            $(this).addClass('active').siblings().removeClass('active');
            ajaxSearchOrder(nowPage,param.pageShow);
    })
    $(".padding-box .clearmar").on("click",".prev",function(){
        if(param.nowPage>1){
            nowPage = param.nowPage - 1;
        }
        ajaxSearchOrder(nowPage,param.pageShow); 
    })
    $(".padding-box .clearmar").on("click",".next",function(){
        if(param.nowPage < param.totalPage){
            nowPage = param.nowPage + 1;
        }
        ajaxSearchOrder(nowPage,param.pageShow); 
    })  