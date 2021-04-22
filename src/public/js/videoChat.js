function videoChat(divId){
  $(`#video-chat-${divId}`).unbind("click").on("click", function(){
    let targetId = $(this).data("chat");
    let callerName = $("#navbar-username").text();

    // console.log(targetId);
    // console.log(callerName);

    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    }

   // console.log(dataToEmit);
   //Step 01 of Caller
   socket.emit("caller-check-listener-online-or-not", dataToEmit);

  })
}

function playVideoStream(videoTagId, steam){
  let video = document.getElementById(videoTagId);
  video.srcObject = steam;
  video.onloadeddata = function(){
    video.play();
  }
}

function closeVideoStream(stream){
  return stream.getTracks().forEach(track => track.stop());
}

$(document).ready(function(){
  //Step 02 of caller
  socket.on("server-send-listener-is-offline", function(){
    alertify.notify("Người dùng này hiện không trưc tuyến", "error", 7)
  })

  // let iceServer = $("#ice-server-list").val();

  let getPeerId = "";
  
  let iceServerList = $("#ice-server-list").val();

  // console.log(iceServerList);

  // console.log(typeof JSON.parse(iceServerList));

  const peer = new Peer({
    key: "peerjs",
    host: "peerjs-server-trungquandev.herokuapp.com",
    secure: true,
    port: 443,
    config: {"iceServers": JSON.parse(iceServerList)},
    debug: 3
  });

  // console.log(peer);
  peer.on("open", function(peerId){
    getPeerId = peerId;
  });
  // console.log(getPeerId); 
  //Step 03
  socket.on("server-request-peer-id-of-listener", function(response){
    let listenerName = $("#navbar-username").text();
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: listenerName,
      listenPeerId: getPeerId
    };

    // console.log(dataToEmit);
    // console.log(listenPeerId)
    //Step 04
    socket.emit("listener-emit-peer-id-to-server", dataToEmit);

  });

  let timeInterval;
  //Step 05 of Caller
  socket.on("server-send-peer-id-of-listener-to-caller", function(response){
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    };

    //Step 06 of Caller
    socket.emit("caller-request-call-to-server", dataToEmit);
  
 
    // console.log("HUHU");
    Swal.fire({ 
      title: `Đang gọi cho <span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `Thời gian <strong style="color: #d43f3a;"></strong> <br/></br/>
          <button id="btn-cancel-call" class="btn btn-danger">
            Hủy cuộc gọi
          </button>
      `,
      backdrop: "rgba(85, 85, 85, 0.4)",
      width: "52rem", //const 32rem
      allowOutsideClick: false,
      timer: 30000, //30 second
      onBeforeOpen: () =>{
        $("#btn-cancel-call").unbind("click").on("click", function(){
          Swal.close();
          clearInterval(timeInterval);

          //Step 07 of caller:
          socket.emit("calller-cancel-request-call-to-server", dataToEmit);

        });

        if(Swal.getContent().querySelector !== null){
          Swal.showLoading()
          timeInterval = setInterval(() =>{
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
          }, 1000);
        }
        
      },
      onOpen:() =>{
        //Step 12 of caller
        socket.on("server-send-reject-call-to-caller", function(response){
          Swal.close();
          clearInterval(timeInterval);
          
          Swal.fire({
            type: "info",
            title: `<span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; Đang bận`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            with: "52rem",
            allowOutsideClick: false, 
            confirmButtonColor: "#2eCC71",
            confirmButtonText: "Xác nhận"
          });
        })

      },
      onClose: () =>{
        clearInterval(timeInterval)
      }
    }).then((result) =>{
      return false;
    });
  });
  //Step 08 of Listener
  socket.on("server-send-request-call-to-listener", function(response){
  let dataToEmit = {
    callerId: response.callerId,
    listenerId: response.listenerId,
    callerName: response.callerName,
    listenerName: response.listenerName,
    listenerPeerId: response.listenerPeerId
  };

  // console.log("HUHU");
  Swal.fire({ 
    title: `<span style="color: #2ECC71;">${response.callerName}</span> &nbsp; đang gọi cho  bạn <i class="fa fa-volume-control-phone"></i>`,
    html: `Thời gian <strong style="color: #d43f3a;"></strong> <br/></br/>
        <button id="btn-reject-call" class="btn btn-danger">
          Từ Chối
        </button>
        <button id="btn-accept-call" class="btn btn-success">
          Đồng Ý.
        </button>
    `,
    backdrop: "rgba(85, 85, 85, 0.4)",
    width: "52rem", //const 32rem
    allowOutsideClick: false,
    timer: 30000, //30 second
    onBeforeOpen: () =>{
      $("#btn-reject-call").unbind("click").on("click", function(){
        Swal.close();
        clearInterval(timeInterval);

        //Step 07 of caller:
        socket.emit("listener-reject-request-call-to-server", dataToEmit);

      });

      $("#btn-accept-call").unbind("click").on("click",function() {
        Swal.close();
        clearInterval(timeInterval);

        // step 11 of listener
        socket.emit("listener-accept-request-call-to-server", dataToEmit);
      });

      if(Swal.getContent().querySelector !== null){
        Swal.showLoading();
        timeInterval = setInterval(() =>{
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
        }, 1000);
      }
    },
    onOpen: () => {
      socket.on("server-send-cancel-request-call-to-listener", function(response) {
        Swal.close();
        clearInterval(timeInterval);
      });

    },
    onClose: () =>{
      clearInterval(timeInterval)
    }
  }).then((result) =>{
    return false;
  });
  })

  //Step 09
  socket.on("server-send-accept-call-to-caller", function(response){
    Swal.close();
    clearInterval(timeInterval);

    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

    getUserMedia({video: true, audio: true}, function(stream){
      
      $("#streamModal").modal("show");
      
      playVideoStream("local-stream", stream);

      let call = peer.call(response.listenerPeerId, stream);

      //listen & play stream of listener
      call.on("stream", function(remoteStream){
        //Play stream of listener
        playVideoStream("remote-stream", remoteStream);
      });

      //Close modal stream
      $("#streamModal").on("hidden.bs.modal", function(){
        closeVideoStream(stream);

        Swal.fire({
          type: "info",
          title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; ></i>`,
          html: `Thời gian <strong style="color: #d43f3a;"></strong> <br/></br/>
          `,
          backdrop: "rgba(85, 85, 85, 0.4)",
          width: "52rem", //const 32rem
          allowOutsideClick: false,
          timer: 30000, //30 second
        });
      });
      
      },function(err){
        console.log('Failed to get local stream', err);
        if(err.toString() === "NotAllowedError: Permission deniend"){
          alertify.notify("Xin lỗi bạn đã tắt quyền truy cập vào thiết bị nghe gọi trên trình duyệt. Vui lòng mở lại.", "error", 7);
        }
        if(err.toString() === "NotFoundError: Request device not found"){
          alertify.notify("Xin lỗi, chúng tôi không tìm thấy thiết bị nghe gọi trên máy tính của bạn", "error", 7);
        }
    })

  })

  socket.on("server-send-accept-call-to-listener", function (response) {     
    console.log("Gui ve listener")
    Swal.close();

    clearInterval(timeInterval);

    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    
    peer.on('call', function(call){
      getUserMedia({video: true, audio: true}, function(stream){
        // const answerCall = confirm("Do you want to answer?")
        $("#streamModal").modal("show");


      //   playVideoStream("local-stream", stream);

      //   call.answer(stream);

      //   call.on('stream', function(remoteStream){
      //     playVideoStream("remote-stream", remoteStream);
      //   });
      //     //Close modal stream
      //   $("#streamModal").on("hidden.bs.modal", function(){
      //     closeVideoStream(stream);
      //     Swal.fire({
      //       type: "info",
      //       title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; ></i>`,
      //       backdrop: "rgba(85, 85, 85, 0.4)",
      //       width: "52rem", //const 32rem
      //       allowOutsideClick: false,
      //       timer: 30000, //30 second
      //       confirmButtonText: "Xác nhận"
      //   });
      //  })
      }, function(err){
        console.log("Failed to get local stream", err);
        if(err.toString() === "NotAllowedError: Permission deniend"){
          alertify.notify("Xin lỗi bạn đã tắt quyền truy cập vào thiết bị nghe gọi trên trình duyệt. Vui lòng mở lại.", "error", 7);
        }
        if(err.toString() === "NotFoundError: Request device not found"){
          alertify.notify("Xin lỗi, chúng tôi không tìm thấy thiết bị nghe gọi trên máy tính của bạn", "error", 7);
        }
      });
    });
  
    })
});