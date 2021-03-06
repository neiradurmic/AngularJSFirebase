function UploadCtrl($scope, $firebaseStorage, $firebaseObject) {

    let fileToUpload = null;
    $scope.onChange = function onChange(fileList) {
        fileToUpload = fileList[0];
    };
    $scope.upload = function() {
        if (fileToUpload) {
            let storageRef = firebase.storage().ref(fileToUpload.name);
            let storage = $firebaseStorage(storageRef);
            let uploadTask = storage.$put(fileToUpload);
            uploadTask.$complete((snapshot) => {
                let ref = firebase.database().ref("Files");
                let pushKey = ref.push().key;
                let formData = $firebaseObject(ref.child(pushKey));
                formData.name = fileToUpload.name;
                formData.timestamp = firebase.database.ServerValue.TIMESTAMP;
                formData.url = snapshot.downloadURL;
                formData.$save().then(() => {
                    angular.element("input[type='file']").val(null);
                    fileToUpload = null;
                })
            });
        }
    }
}

angular
    .module('webApp')
    .controller('UploadCtrl', UploadCtrl)
    .controller('tableCtrl', tableCtrl)
    function tableCtrl($scope, $firebaseStorage, $firebaseObject){
    let fileRef = firebase.database().ref('Files');
    $scope.files = $firebaseObject(fileRef);
    $scope.delete = (key, name) => {
        let storageRef = firebase.storage().ref(name);
        let storage = $firebaseStorage(storageRef);
        storage.$delete().then(() => {
            delete $scope.files[key];
            $scope.files.$save();
        })
    }
}
