$(function(){
    var url = "/rest/servicecenter/getTVVersions";
    var areaJson;
    var temp_html;
    var tvSize = $(this).find("#tvSize");
    var tvSeries = $(this).find("#tvSeries");
    var tvModel = $(this).find("#tvModel");
    //初始化尺寸
    var province = function(){
        var temp_html = "<option value=''>请选择尺寸</option>";
        $.each(areaJson,function(i,province){
            temp_html += "<option value='"+province.uuid+"'>"+province.categoryName+"</option>";
        });
        tvSize.html(temp_html);
//                city();
    };

    //赋值系列
    var size = function(){
        var temp_html = "<option value=''>请选择系列</option>";
        var n = tvSize.get(0).selectedIndex - 1;
        if(areaJson[n].subCotentCategorys != null){
            $.each(areaJson[n].subCotentCategorys,function(i,city){
                temp_html+="<option value='"+city.uuid+"'>"+city.categoryName+"</option>";
            });
            tvSeries.html(temp_html);
        } else{
            tvSeries.html(temp_html);
        }


    };

    //选择省改变市
    tvSize.change(function(){
        size();
    });

    //选择系列修改型号
    tvSeries.change(function(){
        var uuid = tvSeries.val();
        tvModels(uuid);
    });

    //选择型号请求下载地址
    tvModel.change(function(){
        var uuid = tvModel.val();
        tvDownload(uuid);
    });

    //请求电视型号
    function tvModels(data){
        var url =  "/rest/servicecenter/productversion?subCategoryId="+data
        $.get(
            url,
            function(data){
                var temp_html = "<option value=''>请选择型号</option>";
                $.each(data,function(i,moude){
                    temp_html+="<option value='"+moude.uuid+"'>"+moude.name+"</option>";
                });
                tvModel.html(temp_html);
            },
            'json'
        )
    }

    //请求电视说明书下载
    function tvDownload(redata){
        var reurl = "/rest/servicecenter/downservice?versionId="+redata;
        $.get(
            reurl,
            function(data){
                if(data && data.length >0){
                    var url = data[0].url;
                    window.open(url,'_blank')
                }else{
                    $(".alert-box").show();
                    $(".select-mask").css("z-index","20")
                }
            },
            'json'
        )
    }

    //获取json数据
    $.getJSON(url,function(data){
        areaJson = data.retData.subCotentCategorys;
        province();
    });


    $(".tv-cover .j-closebox").click(function(){
        $(".select-mask").hide();
        $(".tv-cover").hide();
    })
    $(".tv-img").click(function(){
        $(".select-mask").css({"z-index": 1, "opacity": 1}).show();;
        $(".tv-cover").show();
    })
});
$(".tv-box .j-close").click(function(){
    $(".tv-box").hide();
    $(".select-mask").css("z-index","1")
})
$(".tv-box .j-ok").click(function(){
    $(".tv-box").hide();
    $(".select-mask").css("z-index","1")
})