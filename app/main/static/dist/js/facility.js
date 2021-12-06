function changeCountry(e){

    document.getElementById("country").disabled = false;
    var sido = document.getElementById("province").value;
    var sigungu = document.getElementById("country");
    //console.log(sigungu.length);
    //console.log(sido);

    sigungu.options[0].selected = true;

    for(var i=1; i<sigungu.length; i++){
     sigungu.options[i].style.display = 'none';
    //console.log(sigungu.options[i].style.display);
    }

    for(var i=0; i<sigungu.length; i++){
        var sigunguSelect = sigungu.options[i].value;
        //console.log(sigunguSelect);
        //console.log(sigungu.options[i].text);
        //console.log("-------------")
        if(sido==sigunguSelect){
           sigungu.options[i].style.display = 'block';
           //console.log(document.getElementsByTagName("option")[i].style.display )
        }
    }
}
    $("#buttonFacility").on('click', function(){
        var sido = document.getElementById("province").value;
        var sigungu = document.getElementById("country");
        sigungu = sigungu.options[sigungu.selectedIndex].text;
        console.log(sido)
        console.log(sigungu)
        var querystring = "";

        querystring +="sido=" + sido;
        querystring +="&sigungu=" + sigungu;
        console.log(querystring)
        location.href="/facility/list?"+querystring;


//
//        $.ajax({
//                 url:"/facility",
//                 type:"POST",
//                 data:JSON.stringify({"sido": sido,"sigungu": sigungu}),
//                 contentType: "application/json",
//                 dataType :"json",
//                 success: function(result) {
//                 if (result) {
//                 alert("잘갔따 잏이히힝힝")
//
//                 } else {
//                 alert("불러오기 실패");
//                 }
//               }
//              });
    })
function onClickFacility(key,wedo,kyungdo){
    console.log(wedo)
    console.log(kyungdo)
    document.getElementById(`${key}_map`).style.display = document.getElementById(`${key}_map`).style.display === 'none'? 'block':'none'


    var mapContainer = document.getElementById(`${key}_map`), // 지도를 표시할 div
        mapOption = {
            center: new kakao.maps.LatLng(wedo, kyungdo), // 지도의 중심좌표
            level: 4 // 지도의 확대 레벨
        };

    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    var imageSrc = '../static/image/location.png', // 마커이미지의 주소입니다
        imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
        imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
        markerPosition = new kakao.maps.LatLng(wedo, kyungdo); // 마커가 표시될 위치입니다

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage // 마커이미지 설정
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
}