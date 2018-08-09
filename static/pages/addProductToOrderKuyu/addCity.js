require(['KUYU.Service'], function() {
	var $http = KUYU.Service;
	var aa = KUYU.SlideBarLogin;
	$(function() {
		$("#sel_province").change(function() {
			var provinceId = $(this).val();
			showCity(provinceId)
			$("#dv_region").hide();
			$("#dv_street").hide();
		})
		$('#sel_city').change(function() {
			var cityId = $(this).val();
			showRegion(cityId);
			$("#dv_region").show();
			$("#dv_street").hide();
		})
		$('#sel_region').change(function() {
				var regionId = $(this).val();
				showStreet(regionId);
				$("#dv_street").show();
			})
	//获取省
		$http.get({
				url: "/usercenter/region/getAllProvince",
				success: function(res) {
					var html = "";
					for(i = 0; i < res.length; i++) {
						var list = res[i];
						html += '<option value="' + list.uuid + '">' + list.provinceName + '</option>'
					}
					$("#sel_province").append(html)
				}
			})
		})
		//获取市
		function showCity(provinceId) {
			$("#sel_city").empty()
			$http.get({
				url: "/usercenter/region/getCitysByProvinceUuid?provinceUuid=" + provinceId,
				data: {},
				success: function(res) {
					var html = "<option value=''>--请选择--</option>";
					for(i = 0; i < res.length; i++) {
						var list = res[i];
						html += '<option value="' + list.uuid + '">' + list.cityName + '</option>'
					}
					$("#sel_city").append(html)
				}
			})
		}
		//获取县
		function showRegion(cityId) {
			$("#sel_region").empty()
			$http.get({
				url: "/usercenter/region/getRegionsByCityUuid?cityUuid=" + cityId,
				data: {},
				success: function(res) {
					var html = "<option value=''>--请选择--</option>";
					for(i = 0; i < res.length; i++) {
						var list = res[i];
						html += '<option value="' + list.uuid + '">' + list.regionName + '</option>'
					}
					$("#sel_region").append(html)
				}
			})
		}
		//获取街道
		function showStreet(regionId) {
			$("#sel_street").empty()
			$http.get({
				url: "/usercenter/region/getStreetsByRegionUuid?regionUuid=" + regionId,
				data: {},
				success: function(res) {
					var html = "<option value=''>--请选择--</option>";
					for(i = 0; i < res.length; i++) {
						var list = res[i];
						html += '<option value="' + list.uuid + '">' + list.streetName + '</option>'
					}
					$("#sel_street").append(html)
				}
			})
		}

	
})