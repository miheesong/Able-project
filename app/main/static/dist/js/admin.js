function setCookie(cookieName, value, exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var cookieValue =
    escape(value) + (exdays == null ? "" : "; expires=" + exdate.toGMTString());
  document.cookie = cookieName + "=" + cookieValue;
}

function deleteCookie(cookieName) {
  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() - 1);
  document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

function getCookie(cookieName) {
  cookieName = cookieName + "=";
  var cookieData = document.cookie;
  var start = cookieData.indexOf(cookieName);
  var cookieValue = "";
  if (start != -1) {
    start += cookieName.length;
    var end = cookieData.indexOf(";", start);
    if (end == -1) end = cookieData.length;
    cookieValue = cookieData.substring(start, end);
  }
  return unescape(cookieValue);
}

(function (w) {
  w.URLSearchParams = w.URLSearchParams || function (searchString) {
      var self = this;
      self.searchString = searchString;
      self.get = function (name) {
          var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(self.searchString);
          if (results == null) {
              return null;
          }
          else {
              return decodeURI(results[1]) || 0;
          }
      };
  }

})(window)

// 숫자 타입에서 쓸 수 있도록 format() 함수 추가
Number.prototype.format = function(){
  if(this==0) return 0;

  var reg = /(^[+-]?\d+)(\d{3})/;
  var n = (this + '');

  while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

  return n;
};

// 문자열 타입에서 쓸 수 있도록 format() 함수 추가
String.prototype.format = function(){
  var num = parseFloat(this);
  if( isNaN(num) ) return "0";

  return num.format();
};

// IE에서 forEach 에러 날 경우
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

function queryStringToJSON(queryString) {
  if (queryString.indexOf("?") > -1) {
    queryString = queryString.split("?")[1];
  }
  var pairs = queryString.split("&");
  var result = {};
  pairs.forEach(function (pair) {
    pair = pair.split("=");
    result[pair[0]] = decodeURIComponent(pair[1] || "");
  });
  return result;
}

function getUrlParams() {
  var params = {};
  decodeURI(window.location.search).replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (str, key, value) {
      params[key] = value;
    }
  );
  return params;
}

function loggedOut() {
  $.ajax({
    url: "/api/v1/auth/logout",
    beforeSend: function (xhr) {
      if (localStorage.token) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.token);
      }
    },
    type: "post",
    success: function (response) {
      if (response.status === "success") {
        localStorage.clear();
        // $(".nav-auth")
        //   .find("a")
        //   .attr("href", "/login")
        //   .removeClass("nav-auth-logout")
        //   .text("로그인");
      }
      location.href = "/admin/login";
    },
    error: function (jqXHR, status) {
      console.log(jqXHR, status);
      if (jqXHR.statusText === "UNAUTHORIZED") {
        // alert("로그인 정보가 만료되었습니다.\n다시 로그인해주세요.");
        // $(".nav-auth")
        //   .find("a")
        //   .attr("href", "/admin/login")
        //   .removeClass("nav-auth-logout")
        //   .text("로그인");
        localStorage.clear();
        location.href = "/admin/login";
      }
      if (jqXHR.statusText === "FORBIDDEN") {
        // alert("로그인 정보가 만료되었습니다.\n다시 로그인해주세요.");
        // $(".nav-auth")
        //   .find("a")
        //   .attr("href", "/admin/login")
        //   .removeClass("nav-auth-logout")
        //   .text("로그인");
        localStorage.clear();
        location.href = "/admin/login";
      }
    },
  });
}

function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + "" + sizes[i];
}

var bar_ctx = document.getElementById('base').getContext('2d');

var background_1 = bar_ctx.createLinearGradient(0, 0, 0, 600);
background_1.addColorStop(0, 'red');
background_1.addColorStop(1, 'blue');

var background_2 = bar_ctx.createLinearGradient(0, 0, 0, 600);
background_2.addColorStop(0, 'green');
background_2.addColorStop(1, 'orange');

var background_3 = bar_ctx.createLinearGradient(0, 0, 0, 600);
background_3.addColorStop(0, 'orange');
background_3.addColorStop(1, 'purple');

var background_4 = bar_ctx.createLinearGradient(0, 0, 0, 600);
background_4.addColorStop(0, 'green');
background_4.addColorStop(1, 'violet');

var background_5 = bar_ctx.createLinearGradient(0, 0, 0, 600);
background_5.addColorStop(0, 'yellow');
background_5.addColorStop(1, 'violet');

var background_6 = bar_ctx.createLinearGradient(0, 0, 0, 600);
background_6.addColorStop(0, 'blue');
background_6.addColorStop(1, 'yellow');

var background_7 = bar_ctx.createLinearGradient(0, 0, 0, 600);
background_7.addColorStop(0, 'pink');
background_7.addColorStop(1, 'green');

var colors = [background_1, background_2, background_3, background_4, background_5, background_6, background_7]
var genreChart = null;
var typeChart = null;
var yearlyChart = null;
var userlogChart = null;

function drawGraphType(country) {
  $.ajax({
    url: "/api/v1/album/types",
    beforeSend: function (xhr) {
      if (localStorage.token) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.token);
      }
    },
    type: "get",
    contentType: "application/json",
    data: {'countrycode': country},
    success: function (response) {
      var typesData = {}
      var labels = [];
      var datas = [];
      var bgColors = [];
      for (var i = 0; i < response.length; i++) {
        labels.push(response[i][0]);
        datas.push(response[i][1]);
        bgColors.push(colors[i % colors.length])
      }
      typesData = {
        labels: labels,
        datasets: [
          {
            label: "",
            backgroundColor: bgColors,
            borderColor: "rgba(60,141,188,0.8)",
            pointRadius: false,
            pointColor: "#3b8bba",
            pointStrokeColor: "rgba(60,141,188,1)",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(60,141,188,1)",
            data: datas,
          },
        ],
      };

      var albumTypeChartData = $.extend(true, {}, typesData);

      if(typeChart != null) {
        typeChart.data.labels = labels;
        typeChart.data.datasets = typesData.datasets;
        typeChart.update()

        $("#type-overlay").hide()
      } else {
        if ($("#albumTypeChart").get(0)) {
          var albumTypeChartCanvas = $("#albumTypeChart")
            .get(0)
            .getContext("2d");
          var albumTypeChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            datasetFill: false,
            legend: {
              display: false
            }
          };
          typeChart = new Chart(albumTypeChartCanvas, {
            type: "bar",
            data: albumTypeChartData,
            options: albumTypeChartOptions,
          });
  
          $("#type-overlay").hide();
        }
      }
    },
    error: function (jqXHR, status) {
      if (jqXHR.status == 401) {
        alert("관리자 인증 토큰 값이 유효하지 않습니다.");
      }
      if (jqXHR.status == 500) {
        alert("서버에 문제가 발생하였습니다.");
      }
    },
  });
}

function drawGraphGenre(country, category) {

  var url = category == "album"? "album/genres" : "song/genres"
  $.ajax({
    url: "/api/v1/" + url,
    beforeSend: function (xhr) {
      if (localStorage.token) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.token);
      }
    },
    type: "get",
    contentType: "application/json",
    data: {'countrycode':country},
    success: function (response) {
      var genresData = {};
      var labels = [];
      var datas = [];
      var bgColors = [];


      if(response) {
        for (var i = 0; i < response.length; i++) {
          labels.push(response[i][0]);
          datas.push(response[i][1]);
          bgColors.push(colors[i % colors.length])
        }
        genresData = {
          labels: labels,
          datasets: [
            {
              label: "",
              backgroundColor: bgColors,
              borderColor: "rgba(60,141,188,0.8)",
              pointRadius: false,
              pointColor: "#3b8bba",
              pointStrokeColor: "rgba(60,141,188,1)",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(60,141,188,1)",
              data: datas,
            },
          ],
        };

        var genresChartData = $.extend(true, {}, genresData);
        if(genreChart != null) {
          genreChart.data.labels = labels;
          genreChart.data.datasets = genresData.datasets;
          genreChart.update()

          $("#genre-overlay").hide()
        } else {
          if ($("#genreChart").get(0)) {
            var genresChartCanvas = $("#genreChart").get(0).getContext("2d");
            var genresChartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              datasetFill: false,
              legend: {
                display: false
              }
            };
            genreChart = new Chart(genresChartCanvas, {
              type: "bar",
              data: genresChartData,
              options: genresChartOptions
            });
            $("#genre-overlay").hide()
          }
        }

       
      }
      
    },
    error: function (jqXHR) {
      if (jqXHR.status == 401) {
        alert("관리자 인증 토큰 값이 유효하지 않습니다.");
      }
      if (jqXHR.status == 500) {
        alert("서버에 문제가 발생하였습니다.");
      }
    },
  });
}

function drawGraphYearly(country) {
  $.ajax({
    url: "/api/v1/album/release/yearly",
    beforeSend: function (xhr) {
      if (localStorage.token) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.token);
      }
    },
    type: "get",
    contentType: "application/json",
    data: {'countrycode':country},
    success: function (response) {
      var yearlyData = {};
      var totalCount = 0;
      var reducer = function(accumulator, currentValue) { return accumulator + currentValue };

      var yearlys = Object.keys(response);
      yearlys = yearlys.filter(function(item) {
        return item !== "null"
      });

      var yearlyCounts = Object.keys(response).map(function(e) {
        return response[e]
      })
      //var yearlyCounts = Object.values(response);
      totalCount = yearlyCounts.reduce(reducer);
      $("#totalCount").text(totalCount.format());

      if(country == 'all')
        $("#countryText").text("전체");
      else if(country == 'kor')
        $("#countryText").text("국내");
      else
        $("#countryText").text("국외");
      // yearlyCounts = yearlyCounts.filter(function(item) {
      //   return item !== "null"
      // });


      if(response) {
        yearlyData = {
          labels: yearlys,
          datasets: [
            {
              label: "",
              backgroundColor: "rgba(60,141,188,0.9)",
              borderColor: "rgba(60,141,188,0.8)",
              pointRadius: false,
              pointColor: "#3b8bba",
              pointStrokeColor: "rgba(60,141,188,1)",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(60,141,188,1)",
              data: yearlyCounts,
            },
          ],
        };

        var yearlyChartData = $.extend(true, {}, yearlyData);
        if(yearlyChart != null) {
          yearlyChart.data.labels = yearlyData.labels;
          yearlyChart.data.datasets = yearlyData.datasets;
          yearlyChart.update()

          $("#yearly-overlay").hide()
        } else {
          if ($("#yearlyChart").get(0)) {
            var yearlyChartCanvas = $("#yearlyChart").get(0).getContext("2d");
            var yearlyChartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              datasetFill: false,
              legend: {
                display: false
              }
            };
            yearlyChart = new Chart(yearlyChartCanvas, {
              type: "bar",
              data: yearlyChartData,
              options: yearlyChartOptions
            });
            $("#yearly-overlay").hide()
          }
        } 

        var years = Object.keys(response);
        var counts = yearlyCounts;
        var html = "";
        var rowOpen = '<div class="statistic-table-row text-center flex"></div>';
        var close = '</div>';
        var header = '<div class="statistic-table-header text-bold">';
        var column = '<div class="statistic-table-column">';
        var field = '<div class="statistic-table-field">';
        $("div.statistic-table").empty()

        for (var i = 0; i < years.length; i++) {
          if(i % 10 == 0)  {
            if(i != 0) {
              $( "div.statistic-table div.statistic-table-row:last-child" ).append(html);
              html = "";
            }
           
            $("div.statistic-table").append(rowOpen);
          }
          html += column;
          html += header;
          html += years[i] == "null"? "기타" : years[i]+'년';
          html += close;

          html += field;
          html += counts[i]+'개';
          html += close;
          html += close;
          if(i == years.length - 1) {
            $( "div.statistic-table div.statistic-table-row:last-child" ).append(html);
          }
        }

      }
    },
    error: function (jqXHR) {
      if (jqXHR.status == 401) {
        alert("관리자 인증 토큰 값이 유효하지 않습니다.");
      }
      if (jqXHR.status == 500) {
        alert("서버에 문제가 발생하였습니다.");
      }
    },
  });
}

function drawGraphUsing(date_category) {
  $.ajax({
    url: "/api/v1/user/logintimes",
    beforeSend: function (xhr) {
      if (localStorage.token) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.token);
      }
    },
    type: "get",
    contentType: "application/json",
    data: {'category':date_category},
    success: function (response) {
      var userlogData = {};
      var labels = [];
      var datas = [];
      var bgColors = [];

      //var date_datas = Object.values(response);

      var date_datas = Object.keys(response).map(function(e) {
        return response[e]
      })

      if(response) {
        for (var i = 0; i < date_datas.length; i++) {
          
          bgColors.push(colors[i % colors.length])

          if(date_category == 'daily') {
            labels.push(response[i]['year'] +"/"+ response[i]['month']+"/"+ response[i]['day']);
            datas.push(response[i]['count']);
          }
          if(date_category == 'monthly') {
            labels.push(response[i]['year'] +"/"+ response[i]['month']);
            datas.push(response[i]['count']);
          }
          if(date_category == 'yearly') {
            labels.push(response[i]['year']);
            datas.push(response[i]['count']);
          }
        }
        userlogData = {
          labels: labels,
          datasets: [
            {
              label: "",
              backgroundColor: bgColors,
              borderColor: "rgba(60,141,188,0.8)",
              pointRadius: false,
              pointColor: "#3b8bba",
              pointStrokeColor: "rgba(60,141,188,1)",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(60,141,188,1)",
              data: datas,
            },
          ],
        };

        var userlogChartData = $.extend(true, {}, userlogData);
        if(userlogChart != null) {
          userlogChart.data.labels = userlogData.labels;
          userlogChart.data.datasets = userlogData.datasets;
          userlogChart.update()

          $("#userlog-overlay").hide()
        } else {
          if ($("#userlogChart").get(0)) {
            var userlogChartCanvas = $("#userlogChart").get(0).getContext("2d");
            var userlogChartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              datasetFill: false,
              legend: {
                display: false
              }
            };
            userlogChart = new Chart(userlogChartCanvas, {
              type: "bar",
              data: userlogChartData,
              options: userlogChartOptions
            });
            $("#userlog-overlay").hide()
          }
        }
      }
      
    },
    error: function (jqXHR) {
      if (jqXHR.status == 401) {
        alert("관리자 인증 토큰 값이 유효하지 않습니다.");
      }
      if (jqXHR.status == 500) {
        alert("서버에 문제가 발생하였습니다.");
      }
    },
  });
}


function addressSearch() {
  new daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

      // 각 주소의 노출 규칙에 따라 주소를 조합한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      var addr = ""; // 주소 변수
      var extraAddr = ""; // 참고항목 변수

      //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === "R") {
        // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
      if (data.userSelectedType === "R") {
        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        // 건물명이 있고, 공동주택일 경우 추가한다.
        if (data.buildingName !== "" && data.apartment === "Y") {
          extraAddr +=
            extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
        }
        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
        if (extraAddr !== "") {
          extraAddr = " (" + extraAddr + ")";
        }
        // 조합된 참고항목을 해당 필드에 넣는다.
        // document.getElementById("sample6_extraAddress").value = extraAddr;
      } else {
        // document.getElementById("sample6_extraAddress").value = '';
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      document.getElementById("postcode").value = data.zonecode;
      document.getElementById("address1").value = addr;
      // 커서를 상세주소 필드로 이동한다.
      document.getElementById("address2").focus();
    },
  }).open();
}

$(document).ready(function () {
  // $('input[type="text"]:not([data-role="tagsinput"])').keydown(function(e) {
  //   console.log(e.keyCode)
  //   if (e.keyCode === 13) {
  //     e.preventDefault();
  //   };
  // });

  // new GreenAudioPlayer('.ready-player-1', { 
  //   showTooltips: true, 
  //   showDownloadButton: false, 
  //   enableKeystrokes: true 
  // });
  if(typeof GreenAudioPlayer != "undefined") { 
    GreenAudioPlayer.init({
      selector: '.player',
      stopOthersOnPlay: true
    });
  } 


  $("div[data-toggle=daterangepicker]").on('click',function() {
    $($(this).data('target')).trigger("click")
  });



  $("a.history-back").click(function(e) {
    history.back(-1)
  });

  
  $(function () {
    if ($(".select2").length > 0) $(".select2").select2();
  });

  $('textarea').each(function () {
    var $this = $(this);
    if ($this.attr('data-placeholder') == undefined) 
        return;
    
    var placeholder = $this.attr('data-placeholder');
    $this.after('<span class="guideTxt">' + placeholder + '</span>');
    $this.keyup(function () {
        if ($this.val().length > 0) 
            $this.next('.guideTxt').hide();
        else if ($this.val().length == 0) 
            $this.next('.guideTxt').show();
    });
    $this.bind('paste', function () {
      $this.next('.guideTxt').hide()
    });
    $this.bind('cut', function () {
        setTimeout(function () {
            if ($this.val().length > 0) 
                $this.next('.guideTxt').hide();
            else if ($this.val().length == 0) 
                $this.next('.guideTxt').show();
            
        }, 0)
    });
  })





  $("#gnb>li").each(function () {
    $(this)
      .mouseenter(function () {
        var liL = $(this).find("ul li").length;
        // alert(liL);
        var liH = $(this).find("ul li").outerHeight();
        $(this)
          .find("ul")
          .stop()
          .animate({ height: liH * liL });
      })
      .mouseleave(function () {
        $("#gnb li ul").stop().animate({ height: 0 });
      });
  });

  $(".nav-auth-logout").on("click", function () {
    loggedOut();
  });

  /* ================================
  * 로그인 페이지
  * 시작
  ===================================*/
  if (location.pathname.indexOf("/login") !== -1) {
    var userInputId = getCookie("userInputId");
    $("input[name='usernick']").val(userInputId);

    if ($("input[name='usernick']").val() != "") {
      // 그 전에 ID를 저장해서 처음 페이지 로딩 시, 입력 칸에 저장된 ID가 표시된 상태라면,
      $("#idSaveCheck").attr("checked", true); // ID 저장하기를 체크 상태로 두기.
    }

    $("#idSaveCheck").change(function () {
      // 체크박스에 변화가 있다면,
      if ($("#idSaveCheck").is(":checked")) {
        // ID 저장하기 체크했을 때,
        var userInputId = $("input[name='usernick']").val();
        setCookie("userInputId", userInputId, 7); // 7일 동안 쿠키 보관
      } else {
        // ID 저장하기 체크 해제 시,
        deleteCookie("userInputId");
      }
    });

    $("input[name='password']").keydown(function (key) {
      if (key.keyCode == 13) {
        $("#btn_login").trigger("click");
      }
    });

    $("#btn_login").on("click", function (e) {

      var obj = new Object();
      var urlParams = new URLSearchParams(window.location.search);
      var next_page = urlParams.get("next");

      obj.usernick = $("input[name='usernick']").val();
      obj.password = $("input[name='password']").val();

      if($("input[name='usernick']").val() == "" || 
      $("input[name='password']").val() == "") {
        alert("아이디/비밀번호를 모두 입력해주세요.");
        e.preventDefault();
        return;
      }
      $("#btn_login").attr("disabled", true);

      $.ajax({
        url: "/api/v1/auth/admin/login",
        type: "post",
        beforeSend: function (xhr, settings) {
          if (
            !/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) &&
            !this.crossDomain
          ) {
            xhr.setRequestHeader(
              "X-CSRFToken",
              $("input[name='csrf_token']").val()
            );
          }
        },
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(obj),
        success: function (response) {
          $("#btn_login").attr("disabled", false);
          localStorage.token = response.Authorization;
          if (next_page) location.href = next_page;
          else location.href = "/admin/";
        },
        error: function (jqXHR, status) {
          console.log(jqXHR, status);
          if (jqXHR.status === 401) {
            alert("아이디 또는 비밀번호가 일치하지 않습니다.");
          }

          if (jqXHR.status === 404) {
            alert("입력하신 아이디가 존재하지 않습니다.");
          }

          if (jqXHR.status === 500) {
            alert("서버 오류가 발생했습니다.")
          }
          $("#btn_login").attr("disabled", false);
        },
      });
    });
  }
  /* ================================
  * 로그인 끝
  ===================================*/



  /* ================================
  * 사용자 목록 페이지
  * 시작
  ===================================*/
  if (location.pathname.indexOf("/admin/users") !== -1) {
    
    var params = getUrlParams();
    if(params.usertype)
      $("select[name='iscompany']").val(params.usertype)
    if(params.start && params.end) {
      $('#reservation').val(params.start+"-"+params.end)
    }
      
    $("input[name='keyword-search'").val(params.sk);

    $("input[name='keyword-search']").keypress(function (e) {
      if (e.which == 13){
        $("#btn-search-user").trigger('click');
      }
    })

    // 사용자 목록 클릭
    $("#user-list tbody tr").on("click", function () {
      var userid = $(this).data("userid");
      location.href = "/admin/user/" + userid;
    });

    // 사용자 검색
    $("#btn-search-user").on('click', function() {
      var search_keyword = $("input[name='keyword-search'").val()
      var iscompany = $("select[name='iscompany']").val();
      var search_date = $('#reservation').val();
      
      var querystring = "";
            
      querystring += "usertype="+iscompany;

      if(search_keyword !== "") {
        querystring += "&sk="+search_keyword;
      } 

      if(search_date !== "") {
        var start = search_date.split("-")[0];
        var end = search_date.split("-")[1];
        if(querystring != "")
          querystring += "&"
        querystring += "start="+start+"&end="+end;
      }

      location.href="/admin/users?"+querystring;  

      // if(search_code !== "") {
      //   var category_code = $("select[name='code-category'").val()
      //   console.log("검색 : ", category, category_code, search_code)
      //   querystring += "cc="+category_code+"&sc="+search_code;
      // }
    });


    $('#reservation').on('apply.daterangepicker', function(ev, picker) {	
      $('#reservation').val(picker.startDate.format('YYYY.MM.DD')+"-"+picker.endDate.format('YYYY.MM.DD'))
    });	
    
    $('#reservation').on('cancel.daterangepicker', function(ev, picker) {	
      $('#reservation').val("")
		});	

    // 사용자 삭제
    $("button.btn-remove-user").click(function(e) {
      e.stopPropagation();
      $('#modal-admin').modal('show');
      var _usernick = $(this).data('user');

      $("#adminConfirm").click(function() {
        $.ajax({
          url: "/api/v1/user/"+_usernick,
          beforeSend: function (xhr) {
            if (localStorage.token) {
              xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.token
              );
            }
          },
          type: "delete",
          success: function (response) {
            alert(response.message);
            location.href = location.href
          },
          error: function (jqXHR, status) {
            console.log(jqXHR, status);
            if(jqXHR.statusText === "UNAUTHORIZED") {
              //loggedOut();
              alert("해당 작업에 대한 권한이 없습니다.");
            }
            if(jqXHR.status == 404) {
              alert(jqXHR.responseJSON.message)
            }
          },
        });

        // if($("input[name='admin-pwd']").val() == "")
        // {
        //   alert("해당 작업을 원하시면 비밀번호를 입력해주세요.");
        //   return;
        // }

        // $.ajax({
        //   type : 'POST',
        //   url : '/api/v1/user/admin/authority/check',
        //   data: {
        //     'adminpwd':$("input[name='admin-pwd']").val()
        //   },
        //   success : function(res) {
        //     console.log(data);
        //     if(res) {
              
        //     }
        //     else {
        //       alert("비밀번호가 다릅니다. 다시 확인해주세요.");
        //       return;
        //     }
        //   },
        //   error : function(error) {
        //     console.log(error);
        //     console.log(error.status);
        //   }
        // });
      });


      

     
    })
  }


  /* ================================
  * 사용자 목록 페이지 끝
  ===================================*/



  /* ================================
  * 사용자 등록 페이지
  * 시작
  ===================================*/
  if (location.pathname.indexOf("/admin/user") !== -1) {
    $('[data-mask]').inputmask();

    $("input[name='agree-attachment']").on('change', function(e) {
      if(e.target.files.length > 0) {
        var filename = e.target.files[0].name;
        var size =  e.target.files[0].size;

        $("a.agree-filename").text(filename + "(" + bytesToSize(size) + ")")
      }
    });

    $("input[name='company-attachment']").on('change', function(e) {
      console.log(e.target.files)
      if(e.target.files.length > 0) {
        var filename = e.target.files[0].name;
        var size =  e.target.files[0].size;

        $("a.company-filename").text(filename + "(" + bytesToSize(size) + ")")
      }
    });

    if (/\/admin\/user\/[a-z0-9A-Z]+/g.test(location.pathname)) {

      $("#btn-update-user").on('click',function() {
        var checkEmpty = false;
        $("input[required]:visible").each(function() {
          if($(this).is(":visible") && $(this).val() === "") {
            alert("필수 정보를 모두 입력해주세요.");
            $(this).focus();
            checkEmpty = true;
            return false;
          }
        });
        if(checkEmpty) return;
  
        
        if($("#duplication_validate").is(':visible')) {
          console.log("이미 사용 중인 아이디입니다.");
          return;
        }
        
        var user_type = $("input[name=user_type]").val();
        var admin_right = [];
        var right_type = [];
        $("input[name=admin_right]:checked").each(function() {
          admin_right.push($(this).val())
        });
        $("input[name=right_type]:visible:checked").each(function() {
          if($(this).val() == "TR") {
            right_type.push($("select[name='trust-select']").val());
          } else {
            right_type.push($(this).val());
          }
        });
  
        if(user_type == 'admin' && admin_right.length == 0) {
          alert("관리자 권한은 최소 한 개 이상 선택해주세요.");
          return;
        }
        if(user_type == 'company' && right_type.length == 0) {
          alert("권리는 최소 한 개 이상 선택해주세요.");
          return;
        }
        
        var usernick = $("input[name=usernick]").val();
        var userpwd = $("input[name=userpwd]").val();
        var companyName = $("input[name=companyName]").val();

        var businessNumber = $("input[name=businessNumber]").val();
        var personalNumber = $("input[name=personalNumber]").val();
        var ownerName = $("input[name=ownerName]").val();
        var managerName = $("input[name=managerName]").val();
        var username = $("input[name=username]").val();
        var dispname = $("input[name=dispname]").val();
        var email = $("input[name=email]").val();

        var tel = $("input[name=tel]").val();
        var ownertel = $("input[name=ownertel]").val();
        var ipiCode = $("input[name=ipiCode]").val();
  
        var zipCode = $("input[name=zipcode]").val();
        var address1 = $("input[name=address1]").val();
        var address2 = $("input[name=address2]").val();

        var statuscode = $("input[name=statuscode]:checked").val();
        var userid = $("input[name=userid]").val();
  
        var data = new FormData()
        // var formData = {
        //   'userid':userid,
        //   'statuscode':statuscode,
        //   'user_type':user_type,
        //   'right_type':right_type.sort().join(','),
        //   'admin_right':admin_right.sort().join(','),
        //   'usernick':usernick,
        //   'userpwd':userpwd,
        //   'companyName':companyName,
        //   'businessNumber':businessNumber,
        //   'personalNumber':personalNumber,
        //   'ownerName':ownerName,
        //   'managerName':managerName,
        //   'username':username,
        //   'dispname':dispname,
        //   'email':email,
        //   'tel':tel,
        //   'ownertel':ownertel,
        //   'ipiCode':ipiCode,
        //   'address1':address1,
        //   'address2':address2,
        //   'zipcode':zipCode
        // };

        data.append("userid", userid);	
        data.append("statuscode", statuscode);	
        data.append("user_type", user_type);	
        data.append("right_type", right_type.sort().join(','));		
        data.append("admin_right", admin_right.sort().join(','));		
        data.append("usernick", usernick);		
        data.append("userpwd", userpwd);		
        data.append("companyName", companyName);		
        data.append("businessNumber", businessNumber);		
        data.append("personalNumber", personalNumber);		
        data.append("ownerName", ownerName);		
        data.append("managerName", managerName);		
        data.append("username", username);		
        data.append("dispname", dispname);		
        data.append("email", email);		
        data.append("tel", tel);
        data.append("ownertel", ownertel);
        data.append("ipiCode", ipiCode);				
        data.append("address1", address1);
        data.append("address2", address2);
        data.append("zipcode", zipCode);

        data.append("agree-attachment", $("input[name='agree-attachment']").prop('files')[0]);
        data.append("company-attachment", $("input[name='company-attachment']").prop('files')[0]);
  


        $.ajax({
          url: "/api/v1/user/",
          type: "put",
          enctype:'multipart/form-data',
          beforeSend: function (xhr) {
            if (localStorage.token) {
              xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.token
              );
            }
          },
          data:data,
          processData: false,
          contentType: false,
          cache: false,
          success: function (response) {
            console.log(response)
            if(response.status == 'success') {
              alert("정보가 수정되었습니다.")
              location.href = location.href;
            }
            else {
              alert("오류가 발생했습니다.")
            }
          },
          error: function(jqXHR, status) {
            console.log(jqXHR, status);
            if(jqXHR.status === 500) {
              alert("오류가 발생했습니다.")
            }
            if(jqXHR.status === 404) {
              alert("해당 사용자를 찾을 수 없습니다.")
            }
          }
        });
      })
    } else {
      $(".personal-information").hide();
      $(".admin-information").hide();
      $(".username-wrap").hide();
      $("input[name='user_type']").val("company");
    }

    $('#user-type-nav a').on('click', function (e) {
      e.preventDefault()
      if($(this)[0].id == 'personal-information-tab') {
        $(".personal-information").fadeIn();
        $(".company-information").hide();
        $(".admin-information").hide();
        $(".username-wrap").show();
        $(".user-information").fadeIn();
        $("input[name='user_type']").val("personal");

        $("label[for=tel]").text("연락처");
        $("input[name=tel]").attr('placeholder',"연락처");
      } else if($(this)[0].id == 'company-information-tab') {
        $(".personal-information").hide();
        $(".company-information").fadeIn();
        $(".admin-information").hide();
        $(".user-information").fadeIn();
        $(".username-wrap").hide();
        $("input[name='user_type']").val("company");

        $("label[for=tel]").text("담당자 연락처");
            $("input[name=tel]").attr('placeholder',"담당자 연락처");
      } else if($(this)[0].id == 'admin-information-tab') {
        $(".personal-information").hide();
        $(".company-information").hide();
        $(".user-information").hide();
        $(".username-wrap").show();
        $(".admin-information").fadeIn();
        $("input[name='user_type']").val("admin");
      }
    })

    $("select[name='user-type-select']").on('change',function() {
      var type = $(this).val()

      if(type == 'company') {
        $(".personal-information").hide();
        $(".company-information").fadeIn();
        $(".admin-information").hide();
        $(".username-wrap").hide();
        $(".user-information").fadeIn();
        $("input[name='user_type']").val("company");
        $("label[for=tel]").text("담당자 연락처");
        $("input[name=tel]").attr('placeholder',"담당자 연락처");
      } else if(type == 'personal') {
        $(".personal-information").fadeIn();
        $(".company-information").hide();
        $(".admin-information").hide();
        $(".username-wrap").show();
        $(".user-information").fadeIn();
        $("input[name='user_type']").val("personal");
        $("label[for=tel]").text("연락처");
        $("input[name=tel]").attr('placeholder',"연락처");
      } else if(type == 'admin') {
        $(".personal-information").hide();
        $(".company-information").hide();
        $(".user-information").hide();
        $(".username-wrap").show();
        $(".admin-information").fadeIn();
        $("input[name='user_type']").val("admin");
      }
    });

    $("input[name='usernick']").keyup(function() {
      var checkId = $(this).val();

      if(checkId.length == 0) {
        $("#duplication_validate").hide();
        return;
      }

      var paths = location.pathname.split('/')
      var current_usernick = paths[paths.length - 1];
      var obj = new Object();
      obj.usernick = checkId;
      obj.curnick = current_usernick;
      $.ajax({
        url: "/api/v1/auth/id-check",
        type: "post",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(obj),
        success: function (response) {
          if(response)
            $("#duplication_validate").hide();
          else
            $("#duplication_validate").show();
        },
        error: function(jqXHR, status) {
          console.log(jqXHR, status);
        }
      });
    });

    $("button#generate-pwd").on('click',function() {
      $.ajax({
        url: "/api/v1/auth/generate/pwd",
        type: "get",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (response) {
          $("#userpwd").val(response);
        },
        error: function(jqXHR, status) {
          console.log(jqXHR, status);
        }
      });
    });
    $("button#direct-pwd").on('click',function() {
      $("#userpwd").removeAttr('disabled')
      $("#userpwd").focus()
    });


    $("#btn-create-user").on('click',function() {
      var checkEmpty = false;
      $("input[required]:visible").each(function() {
        if($(this).is(":visible") && $(this).val() === "") {
          alert("필수 정보를 모두 입력해주세요.");
          $(this).focus();
          checkEmpty = true;
          return false;
        }
      });
      if(checkEmpty) return;

      
      if($("#duplication_validate").is(':visible')) {
        console.log("이미 사용 중인 아이디입니다.");
        return;
      }

      
      var user_type = $("input[name=user_type]").val();
      var admin_right = [];
      var right_type = [];
      $("input[name=admin_right]:checked").each(function() {
				admin_right.push($(this).val())
      });
      $("input[name=right_type]:visible:checked").each(function() {
        if($(this).val() == "TR") {
          right_type.push($("select[name='trust-select']").val());
        } else {
          right_type.push($(this).val());
        }
      });

      if(user_type == 'admin' && admin_right.length == 0) {
        alert("관리자 권한은 최소 한 개 이상 선택해주세요.");
        return;
      }
      if(user_type != 'admin' && right_type.length == 0) {
        alert("권리는 최소 한 개 이상 선택해주세요.");
        return;
      }
      
      var usernick = $("input[name=usernick]").val();
      var userpwd = $("input[name=userpwd]").val();
      var companyName = $("input[name=companyName]").val();

      var businessNumber = $("input[name=businessNumber]").val();
      var personalNumber = $("input[name=personalNumber]").val();
      var ownerName = $("input[name=ownerName]").val();
      var managerName = $("input[name=managerName]").val();
      var username = $("input[name=username]").val();
      var dispname = $("input[name=dispname]").val();
      var email = $("input[name=email]").val();

      var tel = $("input[name=tel]").val();
      var ownertel = $("input[name=ownertel]").val();

      var ipiCode = $("input[name=ipiCode]").val();

      var zipCode = $("input[name=zipcode]").val();
      var address1 = $("input[name=address1]").val();
      var address2 = $("input[name=address2]").val();

      var data = new FormData();

      // var formData = {
      //   'statuscode':1,
      //   'user_type':user_type,
      //   'right_type':right_type.sort().join(','),
      //   'admin_right':admin_right.sort().join(','),
      //   'usernick':usernick,
      //   'userpwd':userpwd,
      //   'companyName':companyName,
      //   'businessNumber':businessNumber,
      //   'personalNumber':personalNumber,
      //   'ownerName':ownerName,
      //   'managerName':managerName,
      //   'username':username,
      //   'dispname':dispname,
      //   'email':email,
      //   'tel':tel,
      //   'ownertel':ownertel,
      //   'ipiCode':ipiCode,
      //   'address1':address1,
      //   'address2':address2,
      //   'zipcode':zipCode,
      // };
      
      data.append("statuscode", 1);	
      data.append("user_type", user_type);	
      data.append("right_type", right_type.sort().join(','));		
      data.append("admin_right", admin_right.sort().join(','));		
      data.append("usernick", usernick);		
      data.append("userpwd", userpwd);		
      data.append("companyName", companyName);		
      data.append("businessNumber", businessNumber);		
      data.append("personalNumber", personalNumber);		
      data.append("ownerName", ownerName);		
      data.append("managerName", managerName);		
      data.append("username", username);		
      data.append("dispname", dispname);		
      data.append("email", email);		
      data.append("tel", tel);
      data.append("ownertel", ownertel);
      data.append("ipiCode", ipiCode);				
      data.append("address1", address1);
      data.append("address2", address2);
      data.append("zipcode", zipCode);

      data.append("agree-attachment", $("input[name='agree-attachment']").prop('files')[0]);
      data.append("company-attachment", $("input[name='company-attachment']").prop('files')[0]);

      $.ajax({
        url: "/api/v1/user/",
        type: "post",
        enctype:'multipart/form-data',
        beforeSend: function (xhr) {
          if (localStorage.token) {
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + localStorage.token
            );
          }
        },
        data:data,
        processData: false,
        contentType: false,
        cache: false,
        success: function (response) {
          console.log(response);
          
          if(response.status == "success") {
            alert("사용자가 생성되었습니다.")
            location.href = "/admin/users";
          } else {
            alert("서버 오류가 발생했습니다.")
          }
        },
        error: function(jqXHR, status) {
          console.log(jqXHR, status);
          if(jqXHR.status === 409) {
            alert("이미 존재하는 아이디입니다.")
          }
          if(jqXHR.status === 500) {
            alert("서버 에러가 발생했습니다.")
          }
        }
      });
    })
    
  }


  /* ================================
  * 사용자 등록 페이지 끝
  ===================================*/




  /* ================================
  * 음원권리정보 조회 페이지
  * 시작
  ===================================*/
  if (location.pathname.indexOf("/admin/musics") !== -1) {
    $(".fullscreen-spinner").fadeOut()

    $(".song-total-count").text($(".song-total-count").text().format());

    $("audio").on("play", function() {
      $("audio").not(this).each(function(index, audio) {
          audio.pause();
      });
    });


    $("input[name=song-all-check]").change(function() {
      console.log($(this).is(":checked"))
      $("input[name=song-check]").prop("checked", $(this).is(":checked"));
    })

    $("button#btn-uci-release").on('click',function(e) {
      //alert("준비중 입니다.");
      var checks = $("input[name=song-check]:checked");
      var arr = [];
      $.each(checks, function(i,item) {
        arr.push($(item).val());
      });

      $("#search-overlay").show();
      console.log(arr)
      $.ajax({
        url: "/api/v1/uci/persist",
        type: "post",
        beforeSend: function(xhr) {
          if (localStorage.token) {
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + localStorage.token
            );
          }
        },
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(arr),
        success: function (response) {
          console.log(response);
          $("#search-overlay").fadeOut();
          var failedArr = [];
          var successArr = [];
          if(response) {
            for(var i = 0 ; i < response.length ; i++) {
              if(response[i].result == 200) {
                if(response[i].songid) {
                  successArr,push(response[i].songid)
                  $("div.song-card[data-songid="+response[i].songid+"]").find('div.uci-status').text("진행중")
                }
                  
              }
              else if (response[i].result == 500) {
                failedArr.push(response[i].songid)
              } 
            }

            if(successArr.length == response.length) {
              alert("선택하신 곡들의 UCI 발급이 완료되었습니다.")
            }

            if(failedArr.length > 0) {
              alert("곡번호 "+ failedArr.join(',')+"의 UCI 발급이 실패했습니다.\n나머지 곡들은 발급이 완료되었습니다.")
            }
          }
        },
        error: function(error) {
          console.log(error);
          validate = false;
          alert("서버 오류가 발생했습니다.\nUCI 발급에 실패하였습니다.")
          $("#search-overlay").fadeOut();
        }
      });
      
    });

    $("audio").each(function() {
      $(this).attr("src", urldecode($(this).attr('src')) )
    });
    // $("audio").on('play',function(e){
    //   $("audio").pause();
    //   console.log("played")
    // })

    $("input[name='albumnm-search']").keydown(function (key) {
      if (key.keyCode == 13) {
        $("#btn-search-soundtrack").trigger("click");
      }
    });

    $("input[name='songnm-search']").keydown(function (key) {
      if (key.keyCode == 13) {
        $("#btn-search-soundtrack").trigger("click");
      }
    });

    $("input[name='publisher-search']").keydown(function (key) {
      if (key.keyCode == 13) {
        $("#btn-search-soundtrack").trigger("click");
      }
    });

    $("input[name='keyword-search']").keydown(function (key) {
      if (key.keyCode == 13) {
        $("#btn-search-soundtrack").trigger("click");
      }
    });

    $("input[name='code-search']").keydown(function (key) {
      if (key.keyCode == 13) {
        $("#btn-search-soundtrack").trigger("click");
      }
    });

    $("div.song-table-cell input[type=checkbox]").on('click', function(e) {
      //e.preventDefault();
      e.stopPropagation();
    });
    $("div.song-table-cell label").on('click', function(e) {
      e.stopPropagation();
    });

    $("#soundtrack-list div.song-card div.track-name.a-tag").on('click', function() {
      console.log("song card")
      var albumid = $(this).data('albumid');
      var songid = $(this).data('songid');

      location.href="/admin/music_detail/a/"+albumid+"/s/"+songid;
    });

    var params = getUrlParams();

    $("input[name='songnm-search'").val(params.sn);
    $("input[name='albumnm-search'").val(params.an);
    $("input[name='publisher-search'").val(params.publisher);
    $("input[name='keyword-search']").val(params.sk);
    $("input[name='code-search']").val(params.sc);

    $("input[name='country'][value="+params.country+"]").prop('checked', true);

    if(params.start && params.end) {
      $('#period').val(params.start+"-"+params.end)
    }

    if(params.dc) {
      $("select[name='date-category']").val(params.dc);
      $("select[name='date-category']").trigger('change'); 
    }
    if(params.cc)
      $("select[name='code-category']").val(params.cc)

    $("select[name='status']").val(params.status);
    $("select[name='status']").trigger('change'); 

    $("ul.pagination a").not( 'a.disabled' ).on('click',function(){
      $("#search-overlay").show();
    })    

    $('#period').on('apply.daterangepicker', function(ev, picker) {	
      $('#period').val(picker.startDate.format('YYYY.MM.DD')+"-"+picker.endDate.format('YYYY.MM.DD'))
    });	
    
    $('#period').on('cancel.daterangepicker', function(ev, picker) {	
      $('#period').val("")
		});	

    $("#btn-search-soundtrack").on("click", function () {

      var country = $("input[name='country']:checked").val();
      var search_status = $("select[name='status']").val();
      var search_publisher = $("input[name='publisher-search'").val()
      var search_song = $("input[name='songnm-search'").val()
      var search_album = $("input[name='albumnm-search'").val()
      var search_code = $("input[name='code-search'").val()
      var search_keyword = $("input[name='keyword-search'").val()
      var search_date = $('#period').val();

      var querystring = "";
      if(country) {
        querystring += "country="+country
      }

      if(search_status !== null && search_status !== "all") {
        if(querystring != "")
          querystring += "&"
        querystring += "status="+search_status;
      }

      if(search_album !== "") {
        if(querystring != "")
          querystring += "&"
        querystring += "an="+search_album;
      }

      if(search_publisher !== "") {
        if(querystring != "")
          querystring += "&"
        querystring += "publisher="+search_publisher;
      }
  
      if(search_song !== "") {
        if(querystring != "")
          querystring += "&"
        querystring += "sn="+search_song;
      }

      if(search_keyword !== "") {
        if(querystring != "")
          querystring += "&"
        querystring += "sk="+search_keyword;
      }

      if(search_date !== "") {
        var start = search_date.split("-")[0];
        var end = search_date.split("-")[1];
        var category_date = $("select[name='date-category'").val()
        if(querystring != "")
          querystring += "&"
        querystring += "dc="+category_date+"&start="+start+"&end="+end;
      }

      if(search_code !== "") {
        var category_code = $("select[name='code-category'").val()
        if(querystring != "")
          querystring += "&"
        querystring += "cc="+category_code+"&sc="+search_code;
      }

      $("#search-overlay").show();
      location.href = "/admin/musics?" + encodeURI(querystring);
     
    });
  }
  /* ================================
  * 음원권리정보 조회 페이지 끝
  ===================================*/

  /* ================================
  * 음원권리정보 상세 페이지
  * 시작
  ===================================*/
  if (location.pathname.indexOf("/admin/music_detail/") !== -1) {
    var songid = location.pathname.split('/s/')[1]

    $("#song-"+songid).trigger('click');
    var offset = $("#song-"+songid).offset();
    $('html, body').animate({scrollTop : offset.top}, 400);

    $("span.keyword-tag").on('click', function() {
      var keyword = $(this).text();
      location.href = "/admin/musics/?sk="+keyword;
    });

    $("#expand-all").on('click', function() {
      if($("#expand-all").text() === "전체 펼치기") {
        $("#expand-all").text("전체 닫기");
        $("tr[data-widget='expandable-table'][aria-expanded='false']").trigger('click');
      } else {
        $("tr[data-widget='expandable-table'][aria-expanded='true']").trigger('click');
        $("#expand-all").text("전체 펼치기");
      }
    });

    $("select.uci-status-select").click(function(e) {
      e.stopPropagation();
    })


  }

  /* ================================
  * 음원권리정보 상세 페이지 끝
  ===================================*/



  /* ================================
  * 업로드 페이지
  * 시작
  ===================================*/
  if (location.pathname.indexOf("/music/upload") !== -1) {
    var albumFile = null;
    $("input[name='albumFile']").change(function(e) {
      // console.log(e.target.files)
      // console.log(e.target.result)
      // $('img.preview').attr('src', e.target.result);
      if (e.target.files && e.target.files[0]) {
        var reader = new FileReader();
        var filename = e.target.files[0].name;
        var size =  e.target.files[0].size;
        if(size > 500000) {
          alert("파일의 최대 용량은 500KB입니다.")
          return;
        }
        $("span.album-image-info").text(filename + "(" + bytesToSize(size) + ")")
        albumFile = e.target.files[0]
        reader.onload = function(e) {
          $('img.preview').attr('src', e.target.result);
          
        }
        reader.readAsDataURL(e.target.files[0]);
      }
    });



    $("input[name='btn-music-upload'").on('click', function(e) {
      var albumName = $("input[name='albumName']").val();
      var albumTypeValue = $("select[name='albumType']").val();
      var albumTypeCode = albumTypeValue.split(',')[0];
      var albumTypeName = albumTypeValue.split(',')[1];
      var albumGenreId = $("select[name='albumGenre']").val();
      var albumSubGenreId = $("select[name='albumSubGenre']").val();
      var albumArtistName = $("input[name='albumArtistName']").val();
      var releaseDate = $("input[name='releaseDate']").val();
      var countryCode = $("select[name='country']").val();

      var albumEditionNo = $("input[name='albumEditionNo']").val();
      var licensorName = $("select[name='licensorName']").val();
      var labelName = $("input[name='labelName']").val();
      var upc = $("input[name='upc']").val();

      
      if(albumName == "") { 
        alert("앨범명을 입력해주세요.");
        return;
      }
      if(albumArtistName == "") { 
        alert("앨범 아티스트명을 입력해주세요.");
        return;
      }
      if(releaseDate == "") { 
        alert("앨범 발매일을 입력해주세요.");
        return;
      }


      var songs = $("#songs-wrap").children("div.song-form");
      var totalMediaCnt = songs.length;
      var songArray = [];
      var validate = false;
      var mainTrackNo = 0;
      if(totalMediaCnt <= 0) {
        alert("최소 한 개의 곡 정보를 입력해주세요.");
        return;
      }

      for(var i = 0 ; i < totalMediaCnt ; i++) {
        var songObj = {};
        if($(songs[i]).find("input[name='trackName']").val() == "") {
          alert("모든 곡의 곡명을 입력해주세요.");
          validate = true;
          break;
        }

        if($(songs[i]).find("input[name='duration']").val() == "") {
          alert("모든 곡의 재생시간을 입력해주세요.");
          validate = true;
          break;
        }

        if($(songs[i]).find("input[name='songArtistName']").val() == "") {
          alert("모든 곡의 대표아티스트를 입력해주세요.");
          validate = true;
          break;
        }

        songObj.trackName = $(songs[i]).find("input[name='trackName']").val();
        songObj.genre = $(songs[i]).find("select[name='genre']").val();
        songObj.subGenre = $(songs[i]).find("select[name='subGenre']").val();

        songObj.trackNumber = i+1;

        songObj.songArtistName = $(songs[i]).find("input[name='songArtistName']").val();
        songObj.writer = $(songs[i]).find("input[name='writer']").val();
        songObj.lyricist = $(songs[i]).find("input[name='lyricist']").val();
        songObj.arranger = $(songs[i]).find("input[name='arranger']").val();
        songObj.translator = $(songs[i]).find("input[name='translator']").val();

        songObj.duration = $(songs[i]).find("input[name='duration']").val();
        songObj.isrc = $(songs[i]).find("input[name='isrc']").val();
        songObj.iswc = $(songs[i]).find("input[name='iswc']").val();
        songObj.uci = $(songs[i]).find("input[name='uci']").val();
        songObj.ismaintrack = $(songs[i]).find("input[name='ismaintrack']").is(":checked");
        

        if(songObj.ismaintrack)
          mainTrackNo = i+1;

        var artistsElements = $(songs[i]).find('div.artist-field-wrap').children("div.artist-field");
        var artistArr = [];
        var artistValidate = false;

        for(var j = 0 ; j < artistsElements.length ; j++) {
          var _rolename = $(artistsElements[j]).find("select[name='rolename']").val();
          var _artistname = $(artistsElements[j]).find("input[name='artistName']").val();

          if(_rolename == "그외") {
            _rolename = $(artistsElements[j]).find("input[name='roleEtcName']").val();
          }
          if(_artistname == "" || _rolename == "") {
            artistValidate = true;
            break;
          }
          artistArr.push(_rolename+" "+_artistname);
        }

        if(artistValidate) {
          alert("누락된 실연정보가 있습니다.");
          break;
        }

        songObj.subArtistName = artistArr.join(',');
        songArray.push(songObj);
      }

      if(validate)
        return;

      if(mainTrackNo == 0 ) {
        alert("메인 트랙을 선택해주세요.");
        return;
      }


      var data = new FormData();
      data.append("albumTypeCode", albumTypeCode);		
      data.append("albumGenreId", albumGenreId);		
      data.append("albumSubGenreId", albumSubGenreId);		
      data.append("albumName", albumName);		
      data.append("albumEditionNo", albumEditionNo);		
      data.append("mainTrackNo", mainTrackNo);		
      data.append("albumArtistName", albumArtistName);		
      data.append("labelName", labelName);		
      data.append("licensorName", licensorName);		
      data.append("totalMediaCnt", totalMediaCnt);		
      data.append("upc", upc);		
      data.append("countryCode", countryCode);		
      data.append("releaseDate", releaseDate);		
      data.append("imagefile", albumFile);				
    	


      $("#upload-overlay").show();

      $.ajax({
        url: "/api/v1/album/user",
        enctype:'multipart/form-data',
        beforeSend: function (xhr) {
          if (localStorage.token) {
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + localStorage.token
            );
          }
        },
        type: "POST",
        data:data,
        processData: false,
        contentType: false,
        cache: false,
        success: function (response) {

          if(response && response.albumid) {
            var i = 0;
            for(i = 0 ; i < totalMediaCnt ; i++) {

              (function(i) {
                var curSong = songArray[i];
                var registed_albumid = response.albumid;
                var songdata = new FormData();
                songdata.append("albumid", registed_albumid);		
                songdata.append("trackname", curSong.trackName);		
                songdata.append("tracknumber", curSong.trackNumber);		
                songdata.append("genreId", curSong.genre);		
                songdata.append("subGenreId", curSong.subGenre);		
                songdata.append("duration", curSong.duration);	

                songdata.append("songArtistName", curSong.songArtistName);
                songdata.append("subArtistName", curSong.subArtistName);

                songdata.append("writer", curSong.writer);		
                songdata.append("lyricist", curSong.lyricist);		
                songdata.append("arranger", curSong.arranger);		
                songdata.append("translator", curSong.translator);		

                songdata.append("isrc", curSong.isrc);		
                songdata.append("iswc", curSong.iswc);		
                songdata.append("uci", curSong.uci);		
  
                $.ajax({
                  url: "/api/v1/song/user",
                  enctype:'multipart/form-data',
                  beforeSend: function (xhr) {
                    if (localStorage.token) {
                      xhr.setRequestHeader(
                        "Authorization",
                        "Bearer " + localStorage.token
                      );
                    }
                  },
                  type: "POST",
                  data: songdata,
                  processData: false,
                  contentType: false,
                  cache: false,
                  success: function (response) {
                    console.log(response)
                  },
                  error: function (jqXHR, status) {
                    console.log(jqXHR, status);
                    if(jqXHR.statusText === "UNAUTHORIZED") {
                      alert("인증 정보가 유효하지 않습니다.\n다시 로그인해주세요.");
                      loggedOut();
                    }
                    if(jqXHR.status == 500) {
                      alert("서버에 문제가 발생했습니다.\n관리자에게 문의해주세요.");

                      // 곡 등록에 에러가 생기면 앨범 정보 삭제
                      $.ajax({
                        url: "/api/v1/album/user/"+registed_albumid,
                        beforeSend: function (xhr) {
                          if (localStorage.token) {
                            xhr.setRequestHeader(
                              "Authorization",
                              "Bearer " + localStorage.token
                            );
                          }
                        },
                        type: "DELETE",
                        success: function (response) {
                          console.log(response)
                        },
                        error: function (jqXHR, status) {
                          console.log(jqXHR, status);
                        }
                      });

                      return;
                    }
                  },
                });
              })(i) 
            }

            if(i == totalMediaCnt)
            {
              alert("등록되었습니다.\n음원 승인 페이지로 이동하여 수락해주세요.");
              $("#upload-overlay").hide();
              location.href="/soundtracks";
            }
  
          }
      
          

        },
        error: function (jqXHR, status) {
          console.log(jqXHR, status);
          if(jqXHR.statusText === "UNAUTHORIZED") {
            alert("인증 정보가 유효하지 않습니다.\n다시 로그인해주세요.");
            loggedOut();
          }

          if(jqXHR.status == 500) {
            alert("서버에 문제가 발생했습니다.\n관리자에게 문의해주세요.");
            return;
          }

          
        },
      });
    });







    $('[data-mask]').inputmask();
    $('input[name="releaseDate"]').inputmask('yyyy-mm-dd', { 'placeholder': '0000-00-00' })

    var songNum = 0;
    $("#btn_add_song").on('click',function() {
      var clone = $("#song-template").clone();

      clone.removeClass('hide')
      clone.removeAttr("id");
      clone.find("input[name='artist-form-toggle']").attr('data-target', '#artist-form-'+songNum);
      clone.find("div.collapse.artist-form").attr('id', 'artist-form-'+songNum);
      clone.find('select.custom-select').addClass('select2')
      clone.find('select.select2').select2()
      songNum++;

      $("#songs-wrap").append(clone);
      $('[data-mask]').inputmask();

      clone.find("input[name='music-attachment']").on('change', function(e) {
        if(e.target.files.length > 0) {
          var filename = e.target.files[0].name;
          var size =  e.target.files[0].size;

          if(size > 20000000) {
            alert("파일의 최대 용량은 25MB입니다.")
            return;
          }
          clone.find("a.attachment-filename").text(filename + "(" + bytesToSize(size) + ")")
        }
      });

      // if(clone.find('select.select2').length > 0)
      //   clone.find('select.select2').select2()
    
      $("input[name='ismaintrack']").on('change',function(e) {
        if($("input[name='ismaintrack']:checked").length > 1) {
          e.preventDefault();
          e.stopPropagation();
          $(this).prop('checked', false).change()
          alert("메인 트랙은 한 개만 선택해주세요.");
          return false;
        }
      });

      var _artist_field = '<div class="artist-field bb-black-1 pb-1 mt-1">\
          <div class="row">\
            <div class="col-xl-5 col-md-6">\
              <div class="mb-2 flex select2-orange">\
                <label class="vertical-form-label" for="rolename">역할</label>\
                <select name="rolename" class="select2" \
                data-dropdown-css-class="select2-orange"\
                  class=" form-control flex1">\
                  <option>보컬</option>\
                  <option>기타</option>\
                  <option>드럼</option>\
                  <option>키보드</option>\
                  <option>피아노</option>\
                  <option>바이올린</option>\
                  <option>첼로</option>\
                  <option>그외</option>\
                </select>\
              </div>\
              <input type="text" class="form-control flex1 hide" name="roleEtcName">\
            </div>\
            <div class="col-xl-5 col-md-5">\
              <div class="mb-2 flex">\
                <label class="vertical-form-label" for="artistName">이름</label>\
                <input type="text" class="form-control flex1" name="artistName">\
              </div>\
            </div>\
            <div class="mt-1 col-xl-2 col-md-1 p-0">\
              <button type="button" name="btn-remove-artist" \
                class="btn btn-sm btn-secondary ">\
                삭제\
              </button>\
            </div>\
          </div>\
        </div>';  
        clone.find("button[name='btn-add-artist']").on('click',function() {
          var wrap = $(this).parent().next("div.artist-field-wrap");
          wrap.append(_artist_field)
          wrap.find('select.select2').select2()
          clone.find("button[name='btn-remove-artist']").on('click',function() {
            $(this).closest('div.artist-field').remove()
          });
        });

        clone.find("button[name='btn-remove-song']").on('click', function() {
          $(clone).remove();
        })

    });

    $("#btn_add_song").trigger('click');
  }

  /* ================================
  * 음원 등록 페이지 끝
  ===================================*/



  /* ================================
  * 음원/권리정보 승인 페이지
  * 시작
  ===================================*/
  if (location.pathname.indexOf("/music/approve") !== -1) {

    if(location.pathname.split('/s/').length > 1) {
      var songid = location.pathname.split('/s/')[1]

      $("#song-"+songid).trigger('click');
      var offset = $("#song-"+songid).offset();
      $('html, body').animate({scrollTop : offset.top}, 400);
    }

    $("#soundtrack-list div.song-card").on('click', function() {
      var albumid = $(this).data('albumid');
      var songid = $(this).data('songid');
      location.href="/admin/music/approve/a/"+albumid+"/s/"+songid;
    });

    $("input[name='keyword-search']").keydown(function (key) {
      if (key.keyCode == 13) {
        $("#btn-search-soundtrack").trigger("click");
      }
    });

    $("input[name='keyword-search2']").keydown(function (key) {
      if (key.keyCode == 13) {
        $("#btn-search-soundtrack").trigger("click");
      }
    });

    $("input[name='code-search']").keydown(function (key) {
      if (key.keyCode == 13) {
        $("#btn-search-soundtrack").trigger("click");
      }
    });

    $("audio").on("play", function() {
      $("audio").not(this).each(function(index, audio) {
          audio.pause();
      });
    });


    $("select[name='keyword-category']").change(function(e) {
      if($(this).val() == $("select[name='keyword-category2']").val()) {
        var random = Math.floor(Math.random() * 2)
        if($(this).val() == 'song') {
          var temp = ['album','artist']
          $("select[name='keyword-category2']").val(temp[random]).trigger('change')
        } else if($(this).val() == 'album') {
          var temp = ['song','artist']
          $("select[name='keyword-category2']").val(temp[random]).trigger('change')
        } else if($(this).val() == 'artist') {
          var temp = ['album','song']
          $("select[name='keyword-category2']").val(temp[random]).trigger('change')
        }
      }
      $("select[name='keyword-category2'] option").prop('disabled',false);
      $("select[name='keyword-category2'] option[value="+$(this).val()+"]").prop('disabled',true);
    });

    $("select[name='keyword-category']").val('song').trigger('change');

    $("select[name='keyword-category2']").change(function(e) {
      $("select[name='keyword-category'] option").prop('disabled',false);
      $("select[name='keyword-category'] option[value="+$(this).val()+"]").prop('disabled',true);
    });

    var params = getUrlParams();
    if (params.ck) $("select[name='keyword-category']").val(params.ck);
    if (params.cc) $("select[name='code-category']").val(params.cc);
    if (params.ck2) $("select[name='keyword-category2']").val(params.ck2);

    $("input[name='keyword-search2'").val(params.sk2);
    $("input[name='keyword-search'").val(params.sk);
    $("input[name='code-search'").val(params.sc);

    $("input[name='country'][value="+params.country+"]").prop('checked', true);
    $("input[name='islibrary']").prop('checked', params.islibrary == 1 ? true : false);

    $("ul.pagination a").not( 'a.disabled' ).on('click',function(){
      $("#search-overlay").show();
    })    

    $("#btn-search-soundtrack").on("click", function () {

      var tab = $("a.nav-link.active").data('tab');

      var country = $("input[name='country']:checked").val();
      var islibrary = $("input[name='islibrary']:checked").prop('checked');
      var search_keyword = $("input[name='keyword-search'").val()
      var search_keyword2 = $("input[name='keyword-search2'").val()
      var search_code = $("input[name='code-search'").val()
      var querystring = "tab="+tab;
      if(country) {
        querystring += "&country="+country
      }

      querystring += "&islibrary="+ (islibrary ? "1":"0");

      if(search_keyword !== "") {
        var category_keyword = $("select[name='keyword-category'").val()

        if(querystring != "")
          querystring += "&"
        querystring += "ck="+category_keyword+"&sk="+search_keyword;
      }

      if(search_keyword2 !== "") {
        var category_keyword2 = $("select[name='keyword-category2'").val()

        if(querystring != "")
          querystring += "&"
        querystring += "ck2="+category_keyword2+"&sk2="+search_keyword2;
      }

      if(search_code !== "") {
        var category_code = $("select[name='code-category'").val()

        if(querystring != "")
          querystring += "&"
        querystring += "cc="+category_code+"&sc="+search_code;
      }
      $("#search-overlay").show();
      location.href = "/admin/music/approves?" + querystring;
     
    });
  }

  /* ================================
  * 음원/권리정보 승인 페이지 끝
  ===================================*/

    /* ================================
  * 음원/권리정보 상세 페이지
  * 시작
  ===================================*/
  if (location.pathname.indexOf("/admin/music/approve") !== -1) {

    $("#expand-all").on('click', function() {
      if($("#expand-all").text() === "전체 펼치기") {
        $("#expand-all").text("전체 닫기");
        $("tr[data-widget='expandable-table'][aria-expanded='false']").trigger('click');
      } else {
        $("tr[data-widget='expandable-table'][aria-expanded='true']").trigger('click');
        $("#expand-all").text("전체 펼치기");
      }
    });

    $("button[name='btn-agree-song']").on('click',function(e) {
      e.preventDefault();
      e.stopPropagation();
      var _obj = {
        "songid":$(this).data('songid'),
        "agree":1
      }

      // var ele = $("tbody.song-wrap tr#"+$(this).data('songid')).children('td').eq(1);
      // ele.html('<span class="right badge badge-primary p-2">수락</span>');

      $.ajax({
        url: "/api/v1/song/user/status",
        beforeSend: function (xhr) {
          if (localStorage.token) {
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + localStorage.token
            );
          }
        },
        contentType : "application/json",
        data: JSON.stringify(_obj),
        type: "post",
        success: function (res) {
          console.log(res);
          var ele = $("tbody.song-wrap tr#song-"+_obj.songid).children('td').eq(1);
          ele.html('<span class="right badge badge-primary p-2">수락</span>');
        },
        error: function (jqXHR) {
          console.log(jqXHR);
          if(jqXHR.status === 500) {
            alert("서버 에러가 발생했습니다.")
          }
        },
      });
    });

    $("button[name='btn-reject-song']").on('click',function(e) {
      e.preventDefault();
      e.stopPropagation();
      var _obj = {
        "songid":$(this).data('songid'),
        "agree":-1
      }
      $.ajax({
        url: "/api/v1/song/user/status",
        beforeSend: function (xhr) {
          if (localStorage.token) {
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + localStorage.token
            );
          }
        },
        contentType : "application/json",
        data: JSON.stringify(_obj),
        type: "post",
        success: function (res) {
          console.log(res);
          if(res.status == "success") {
            var ele = $("tbody.song-wrap tr#song-"+_obj.songid).children('td').eq(1);
            ele.html('<span class="right badge badge-danger p-2">승인거부</span>');
          } else {
            alert(res.message);
          }
  
        },
        error: function (jqXHR) {
          console.log(jqXHR);

          if(jqXHR.status === 500) {
            alert("서버 에러가 발생했습니다.")
          }
        },
      });
    });

  }

  /* ================================
  * 음원/권리정보 상세 페이지 끝
  ===================================*/

  /* ================================
  * 통계 페이지 
  * 시작
  ===================================*/

  if (location.pathname.indexOf("/admin/statistics/type") !== -1) {
    $("input[name='country_code']").change(function() {
      $("#type-overlay").show();
      $("#genre-overlay").show()
      drawGraphType($(this).val());
      drawGraphGenre($(this).val(), $("input[name='category']").val());
    });

    $("input[name='category']").change(function() {
      if($(this).val() =="album") {
        $("#albumTypeChart-container").show();
      } else if($(this).val() =="song") {
        $("#albumTypeChart-container").hide();
      }
      $("#genre-overlay").show()
      drawGraphGenre($("input[name='country_code']").val(), $(this).val());
    });

    drawGraphType('all');
    drawGraphGenre('all', 'album');
  }

  if (location.pathname.indexOf("/admin/statistics/yearly") !== -1) {
    $("input[name='country_code']").change(function() {
      $("#yearly-overlay").show()
      drawGraphYearly($(this).val());
    })

    drawGraphYearly('all'); 
  }

  if (location.pathname.indexOf("/admin/statistics/using") !== -1) {
    $("input[name='date_category']").change(function() {
      $("#userlog-overlay").show()
      drawGraphUsing($(this).val());
    })

    drawGraphUsing('daily'); 
  }
  /* ================================
  * 통계 페이지 끝
  ===================================*/

  /* ================================
  * 권리중복 페이지 
  * 시작
  ===================================*/
  if(location.pathname.indexOf("conflict") != -1) {
    if($(".fullscreen-spinner").length > 0)
      $(".fullscreen-spinner").fadeOut();

    $(".song-total-count").text($(".song-total-count").text().format());

    $("#btn-right-duplicate").on('click',function() {
      var checks = $("input[name=conflict]:checked");
      if(checks.length == 0) {
        alert("최소 한 개의 권리중복 데이터를 선택해주세요.")
        return ;
      }
      var arr = [];
      $.each(checks, function(i,item) {
        arr.push($(item).val());
      });
      console.log(arr)

      location.href="/admin/music/conflict?c="+arr.join(',');
    }); 

    $("#btn_go_emailpage").on('click', function() {
      var emails = [];
      $("input[name=conf-check]:checked").each(function(item) {
        var email_element = $(this).parents('tr').find('p.sub-info-desc > span.email');
        email_element.each(function() {
          emails.push($(this).text())
        })
      })
      console.log(emails);
      localStorage.setItem("conflict_emails", emails)

      location.href="/admin/music/conflict/send_mail"
    });
    if( $("input[name=conflict-all-check]").length > 0) {
      $("input[name=conflict-all-check]").change(function() {
        $("input[name=conf-check]").prop("checked", $(this).is(":checked"));
      })
    }


    if($('input[name=recipients]').length > 0) {
      var emails = localStorage.getItem("conflict_emails");
      $('input[name=recipients]').tagsinput('add', emails);
    }

    $('#btn_update_conflict').on('click',function() {
      var data = new FormData()
      data.append('status', $("select[name=conflict-status-select]").val());
      data.append('memo', $("textarea[name=memo]").val());

      console.log({
        'status': $("select[name=conflict-status-select]").val(),
        'memo': $("textarea[name=memo]").val()
      });

      // $.ajax({
      //   url: "/api/v1/conflict/",
      //   type: "put",
      //   enctype:'multipart/form-data',
      //   data:data,
      //   processData: false,
      //   contentType: false,
      //   cache: false,
      //   beforeSend: function (xhr) {
      //     if (localStorage.token) {
      //       xhr.setRequestHeader(
      //         "Authorization",
      //         "Bearer " + localStorage.token
      //       );
      //     }
      //   },
      // });
    });

    $("#btn_send_email").on('click', function() {
      $("#btn_send_email").attr('disabled',true);

      var data = new FormData()
      if($("input[name=subject]").val() == "") {
        alert("보내는사람 이메일을 입력해주세요.");
        $("#btn_send_email").attr('disabled',false);
        return;
      }
      if($("input[name=recipients]").val() == "") {
        alert("받는사람 이메일을 입력해주세요.");
        $("#btn_send_email").attr('disabled',false);
        return;
      }
      $("#upload-overlay").show();
      $(".fullscreen-spinner").show();
      data.append('subject', $("input[name=subject]").val())
      data.append('sender', $("input[name=sender]").val())
      data.append('recipients',$("input[name=recipients]").val())
      data.append('content',$("textarea[name=content]").val())

      $.ajax({
        url: "/api/v1/conflict/send_email",
        type: "post",
        enctype:'multipart/form-data',
        beforeSend: function (xhr) {
          if (localStorage.token) {
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + localStorage.token
            );
          }
        },
        data:data,
        processData: false,
        contentType: false,
        cache: false,
        success: function (res) {
          console.log(res);
          alert(res.message);
          $("#btn_send_email").attr('disabled',false);
          $("#upload-overlay").hide();
        },
        error: function(err) {
          console.log(err);
          $("#upload-overlay").hide();
          $("#btn_send_email").attr('disabled',false);
          alert("서버측 오류가 발생하였습니다.\n전송에 실패하였습니다.")
        }
      })
    });

    $("input[name='albumnm-search']").keydown(function (key) {
      if (key.keyCode == 13) {
        $("#btn-search-soundtrack").trigger("click");
      }
    });

    $("input[name='songnm-search']").keydown(function (key) {
      if (key.keyCode == 13) {
        $("#btn-search-soundtrack").trigger("click");
      }
    });

    $("input[name='publisher-search']").keydown(function (key) {
      if (key.keyCode == 13) {
        $("#btn-search-soundtrack").trigger("click");
      }
    });
    var params = getUrlParams();

    $("input[name='songnm-search'").val(params.sn);
    $("input[name='albumnm-search'").val(params.an);
    $("input[name='publisher-search'").val(params.publisher);
    $("input[name='code-search']").val(params.sc);

    $("input[name='country'][value="+params.country+"]").prop('checked', true);

    if(params.start && params.end) {
      $('#period').val(params.start+"-"+params.end)
    }

    if(params.dc) {
      $("select[name='date-category']").val(params.dc);
      $("select[name='date-category']").trigger('change'); 
    }
    if(params.cc)
      $("select[name='code-category']").val(params.cc)

    $("select[name='status']").val(params.status);
    $("select[name='status']").trigger('change'); 

    $("ul.pagination a").not( 'a.disabled' ).on('click',function(){
      $("#search-overlay").show();
    })    

    $('#period').on('apply.daterangepicker', function(ev, picker) {	
      $('#period').val(picker.startDate.format('YYYY.MM.DD')+"-"+picker.endDate.format('YYYY.MM.DD'))
    });	
    
    $('#period').on('cancel.daterangepicker', function(ev, picker) {	
      $('#period').val("")
		});	



    $("#btn-search-conflict").on("click", function () {

      var search_status = $("select[name='status']").val();
      var search_publisher = $("input[name='publisher-search'").val()
      var search_song = $("input[name='songnm-search'").val()
      var search_album = $("input[name='albumnm-search'").val()
      var search_date = $('#period').val();

      var querystring = "";

      if(search_status !== null && search_status !== "all") {
        if(querystring != "")
          querystring += "&"
        querystring += "status="+search_status;
      }

      if(search_album !== "") {
        if(querystring != "")
          querystring += "&"
        querystring += "an="+search_album;
      }

      if(search_publisher !== "") {
        if(querystring != "")
          querystring += "&"
        querystring += "publisher="+search_publisher;
      }
  
      if(search_song !== "") {
        if(querystring != "")
          querystring += "&"
        querystring += "sn="+search_song;
      }

      if(search_date !== "") {
        var start = search_date.split("-")[0];
        var end = search_date.split("-")[1];
        //var category_date = $("select[name='date-category'").val()
        if(querystring != "")
          querystring += "&"
        querystring += "start="+start+"&end="+end;
      }

      $("#search-overlay").show();
      location.href = "/admin/conflicts?" + encodeURI(querystring);
     
    });
  }
  /* ================================
  * 권리중복 페이지 끝
  ===================================*/

  
  if(location.pathname.indexOf("/admin/user") != -1) {
    $("li.nav-item[data-id='user']").addClass('menu-is-opening').addClass('menu-open');
  } else if(location.pathname.indexOf("/admin/music") != -1) {
    $("li.nav-item[data-id='music']").addClass('menu-is-opening').addClass('menu-open');
  } else if(location.pathname.indexOf("/admin/statistics") != -1) {
    $("li.nav-item[data-id='statistics']").addClass('menu-is-opening').addClass('menu-open');
  }
  

  if($('#period').is(":visible")) {
    $(function() {
    $('#period').daterangepicker({
      autoUpdateInput :false,
      language: "kr",
      "locale": {
        "format": "YYYY.MM.DD",
        "fromLabel": "부터",
        "toLabel": "까지",
        "separator": "-",
        "customRangeLabel": "Custom",
        "applyLabel": "적용",
        "cancelLabel": "취소",
        "daysOfWeek": [
          "일",
          "월",
          "화",
          "수",
          "목",
          "금",
          "토"
        ],
        "monthNames": [
          "1월",
          "2월",
          "3월",
          "4월",
          "5월",
          "6월",
          "7월",
          "8월",
          "9월",
          "10월",
          "11월",
          "12월"
        ],
        "firstDay": 1
      }
    })

    
    $('#period').on('apply.daterangepicker', function(ev, picker) {	
      $('#period').val(picker.startDate.format('YYYY.MM.DD')+"-"+picker.endDate.format('YYYY.MM.DD'))
    });	
    
    $('#period').on('cancel.daterangepicker', function(ev, picker) {	
      $('#period').val("")
		});	
  });
  }

  $(function() {
      //Date range picker
    $('#reservation').daterangepicker({
      autoUpdateInput :false,
      language: "kr",
      "locale": {
        "format": "YYYY.MM.DD",
        "fromLabel": "부터",
        "toLabel": "까지",
        "separator": "-",
        "customRangeLabel": "Custom",
        "applyLabel": "적용",
        "cancelLabel": "취소",
        "daysOfWeek": [
          "일",
          "월",
          "화",
          "수",
          "목",
          "금",
          "토"
        ],
        "monthNames": [
          "1월",
          "2월",
          "3월",
          "4월",
          "5월",
          "6월",
          "7월",
          "8월",
          "9월",
          "10월",
          "11월",
          "12월"
        ],
        "firstDay": 1
      }
    })
  });

});
