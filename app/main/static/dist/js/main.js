if (location.pathname.indexOf("/") !== -1) {
    //게시글 상세보기
    $("#club_main li").on('click', function() {
      var bdid = $(this).data('bdid');
      if (bdid != null) {
        location.href="/boards/"+bdid;
      }
     });

 }


if (location.pathname.indexOf("/club") !== -1) {
    //게시글 상세보기
    $("#table-club tr").on('click', function() {
      var bdid = $(this).data('bdid');
      if (bdid != null) {
        //console.log(bdid);
        location.href="/boards/"+bdid;
      }
    });

    //검색
    $("#btn-search-club").on('click', function () {
      var area = $("select[name='areas']").val();
      var sport = $("select[name='sports']").val();
      var search_keyword = $("input[name='name']").val()
      var querystring = "";
//      console.log(area)
//      console.log(sport)
//      console.log(search_keyword)
      if( area != "") {
        querystring += "area=" + area;
      }
      if ( sport != "") {
        querystring += "&sport=" + sport;
      }
      if ( search_keyword != "") {
        querystring += "&search_keyword=" + search_keyword;
      }
//      console.log(querystring);

       location.href = "/club?" + querystring;


    });

 }

if (location.pathname.indexOf("/login") !== -1) {
  $("#btn-login").on('click', function() {
   var id = $("input[name='id']").val();
   var pwd = $("input[name='pwd']").val();

   var obj = new Object();
   obj.id = id;
   obj.pwd = pwd;


   $.ajax({
    url: "/login",
    type: "post",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(obj),
    dataType: "json",
    cache: false,
    processData: false,
    success: function (response) {
      console.log(response);
      if (response.status == "success") {
        location.href = "/"
      } else {
        alert("아이디 또는 비밀번호가 잘못 입력 되었습니다.")
      }
    },
    error: function (jqXHR, status) {
      console.log(jqXHR, status);
      if (jqXHR.status === 500) {
        alert("서버 에러가 발생했습니다.")
      }
    }
  });
  });
}
if (location.pathname.indexOf("/board") !== -1) {
    //게시글 상세보기
    $("#table-board tr").on('click', function() {
      var bdid = $(this).data('bdid');
      if (bdid != null) {
        console.log(bdid);
        location.href="/post/"+bdid;
      }
    });

    //검색
    $("#btn-search-post").on('click', function () {
       var keyword = $("input[name='keyword']").val();
       location.href = "/board?search_keyword=" + keyword;
    });
}

//자유게시판 글쓰기
if (location.pathname.indexOf("/board/upload/") !== -1) {
    //등록하기 버튼 클릭 시
   $("#btn_upload").on('click', function () {
      var type = $("select[name='type']").val();
      var title = $("input[name='title']").val();
      var content = $("textarea[name='content']").val();

     var obj = new Object();
     obj.type = type;
     obj.title = title;
     obj.content = content;


     $.ajax({
      url: "/board/upload/",
      type: "post",
      contentType: "application/json;charset=UTF-8",
      data: JSON.stringify(obj),
      dataType: "json",
      cache: false,
      processData: false,
      success: function (response) {
        console.log(response);
        if (response.status == "success") {
          alert("게시글이 생성 되었습니다.")
          location.href = "/board"
        } else {
          alert("서버 오류가 발생했습니다.")
        }
      },
      error: function (jqXHR, status) {
        console.log(jqXHR, status);
        if (jqXHR.status === 500) {
          alert("서버 에러가 발생했습니다.")
        }
      }
    });
  });
 }

 // 자유게시판 게시글 상세
 if (location.pathname.indexOf("/post") !== -1) {
    //댓글 등로 버튼 클릭 시 댓글 창 열기
    $("#btn-comment").on('click', function () {
        var btn_display = $("#comment").css("display");
        if(btn_display == "none") {
          $('#comment').show();
        } else {
          $('#comment').hide();
        }
    });

    //댓글 등록 버튼 클릭 시
    $("#btn-post").on('click', function () {
        var href = location.href;
        var bdid = href.match(/([^\/]*)\/*$/)[1];
        var comment = $('#comment-content').val();

        var obj = new Object();
        obj.bdid = bdid;
        obj.comment = comment;

        if( comment != '') {
          $.ajax({
            url: "/post/"+bdid,
            type: "post",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(obj),
            dataType: "json",
            cache: false,
            processData: false,
            success: function (response) {
              console.log(response);
              if (response.status == "success") {
                alert("댓글이 생성 되었습니다.")
                location.href = href;
              } else {
                alert("서버 오류가 발생했습니다.")
              }
            },
            error: function (jqXHR, status) {
              console.log(jqXHR, status);
              if (jqXHR.status === 500) {
                alert("서버 에러가 발생했습니다.")
              }
            }
          });
        }
    });

 }