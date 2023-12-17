const singleSelector = document.querySelector.bind(document)
const multipleSelector = document.querySelectorAll.bind(document)

const filePhotoFront = singleSelector('.file-input-front')
const showFileNameFront  = singleSelector('.file-name-front')
const filePlaceholderFront = singleSelector('.file-placeholder-front')
const fileImageFront = singleSelector('.file-image-front')

const filePhotoBackSide = singleSelector('.file-input-backside')
const showFileNameBackSide  = singleSelector('.file-name-backside')
const filePlaceholderBackSide = singleSelector('.file-placeholder-backside')
const fileImageBackSide = singleSelector('.file-image-backside')


function validEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

function onlyLettersAndSpaces(str){
    var re = /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    return re.test(str);
}

const detailsUserTab = singleSelector('.admin-detail-user-info') 
const idCardUserTab = singleSelector('.admin-detail-user-id-card')
const userContentInfo = singleSelector('.admin-detail-user-content-info')
const userContentIdCard = singleSelector('.admin-detail-user-content-item-id-card')

if(detailsUserTab && idCardUserTab){
    detailsUserTab.addEventListener('click', () => {
        userContentInfo.style.display = 'block'
        userContentInfo.style.animation = 'OpacityIn ease .8s'
        userContentIdCard.style.display = 'none'
        idCardUserTab.classList.remove('admin-detail-user-tab-active')
        detailsUserTab.classList.add('admin-detail-user-tab-active')
    })

    idCardUserTab.addEventListener('click', () => {
        userContentInfo.style.display = 'none'
        userContentIdCard.style.display = 'block'
        userContentIdCard.style.animation = 'OpacityIn ease .8s'
        detailsUserTab.classList.remove('admin-detail-user-tab-active')
        idCardUserTab.classList.add('admin-detail-user-tab-active')
    })
}

const noTransactions = singleSelector('.js-no-transactions')
const haveTransactions = singleSelector('.js-have-transactions')

if(noTransactions && haveTransactions){
    // noTransactions.classList.add('admin-transaction-history-content-no-transactions')
    // haveTransactions.classList.remove('admin-transaction-history-content-table-show')
}


// modal
// start
const jsBtnDetailUserVerification = singleSelector('.js-btn-detail-user-verification')
const jsBtnDetailUserCancel = singleSelector('.js-btn-detail-user-cancel')
const jsBtnDetailUserAdditional = singleSelector('.js-btn-detail-user-additional')
const jsBtnDetailUserUnlock = singleSelector('.js-btn-detail-user-unlock')


const jsModalDetailUser = singleSelector('.js-modal-detail-user')
const jsModalDetailUserClose = singleSelector('.js-modal-detail-user-close')
const jsModalDetailUserIconClose = singleSelector('.js-modal-detail-user-icon-close')
const modalHeaderTitle = singleSelector('.modal-header-title')
const modalHeaderCntent = singleSelector('.modal-header-content')

function showModalDetailUser(){
    jsModalDetailUser.classList.add('modal-active-detail-user')
}

function hideModalDetailUser(){
    jsModalDetailUser.classList.remove('modal-active-detail-user')
}

if(jsBtnDetailUserVerification && jsModalDetailUserClose && jsBtnDetailUserCancel && jsBtnDetailUserAdditional || jsBtnDetailUserUnlock && jsModalDetailUserClose){
    let name = document.getElementById("nameUser").innerHTML
    if(jsBtnDetailUserVerification !== null)
    {
        jsBtnDetailUserVerification.addEventListener('click', () => {
            showModalDetailUser()
            modalHeaderTitle.innerHTML = `Verification`
            modalHeaderCntent.innerHTML = `Do you agree with <b>${name}</b> information?`
        })
    }

    if(jsBtnDetailUserCancel !== null)
    {
        jsBtnDetailUserCancel.addEventListener('click', () => {
            showModalDetailUser()
            modalHeaderTitle.innerHTML = `Cancel`
            modalHeaderCntent.innerHTML = `You want to disable <b>${name}</b> account`
        })
    }

    if(jsBtnDetailUserAdditional !== null)
    {
        jsBtnDetailUserAdditional.addEventListener('click', () => {
            showModalDetailUser()
            modalHeaderTitle.innerHTML = `Additional`
            modalHeaderCntent.innerHTML = `Do you want <b>${name}</b> to update identity card?`
        })
    }

    if(jsBtnDetailUserUnlock != null)
    {
        jsBtnDetailUserUnlock.addEventListener('click', () => {
            showModalDetailUser()
            modalHeaderTitle.innerHTML = `Unlock`
            modalHeaderCntent.innerHTML = `Do you want to unlock <b>${name}</b> account?`
        })
    
    }
    
    jsModalDetailUserClose.addEventListener('click', hideModalDetailUser)
    jsModalDetailUserIconClose.addEventListener('click', hideModalDetailUser)
}


// end








// Show nav admin
// start
const navAdmin = singleSelector('.nav-admin')
const headeResponsiveIconMenu = singleSelector('.header-responsive-icon-menu')
const navOverlay = singleSelector('.nav-overlay')

function showNavAdmin(){
    navAdmin.classList.add('nav-admin-show')
    navOverlay.style.display = "block"
}

function hideNavAdmin(){
    navAdmin.classList.remove('nav-admin-show')
    navOverlay.style.display = "none"
}

if(headeResponsiveIconMenu){
    headeResponsiveIconMenu.addEventListener('click', showNavAdmin)
    navOverlay.addEventListener('click', hideNavAdmin)
}

const jsItemsExtra = singleSelector('.js-items-extra')
const jsMenuItemsLink = multipleSelector('.js-menu-items-link')
const jsMenuItemsArrowicon1 = singleSelector('.js-menu-items-arrowicon1')
const jsMenuItemsArrowicon2 = singleSelector('.js-menu-items-arrowicon2')

function showMenuExtra(){
    jsItemsExtra.classList.toggle('active')
    jsMenuItemsArrowicon1.classList.toggle('active')
    jsMenuItemsArrowicon2.classList.toggle('active')
    
}

function hideMenuExtra(){
    jsItemsExtra.classList.add('active')
}

if(jsItemsExtra){
    for(i = 0 ; i< jsMenuItemsLink.length; i++){
        jsMenuItemsLink[i].addEventListener('click', showMenuExtra)
    }
}

const navUserSettingMenu = singleSelector('.nav-user-setting-menu')
const navUserSettingIconVector = singleSelector('.nav-user-setting-icon-vector')
const body =  singleSelector('body')

function showNavUserSettingMenu(e){
    navUserSettingMenu.classList.toggle('active')
    e.stopPropagation()
}

function hideNavUserSettingMenu(){
    navUserSettingMenu.classList.remove('active')
}

if(navUserSettingMenu){
    navUserSettingIconVector.addEventListener('click', showNavUserSettingMenu)
    navUserSettingMenu.addEventListener('click', (e) => {
        e.stopPropagation()
    })
    body.addEventListener('click', hideNavUserSettingMenu)
}
// end


// user infor - change password
// start
// const jsAdminPasswordHeaderTitle = singleSelector('.js-admin-password-header-title')
// const jsAdminTransactionHeaderTitle = singleSelector('.js-admin-transaction-header-title')
// const jsAdminUpdateIdCardHeaderTitle = singleSelector('.js-admin-update-id-card-header-title')

// const jsAdminTransactionHistoryContent = singleSelector('.js-admin-transaction-history-content')
// const jsAdminContentPageChangePassword = singleSelector('.js-admin-content-page-change-password')
// const jsAdminDetailUserUpdateDdCard = singleSelector('.js-admin-detail-user-update-id-card')

const  jsModalChangePasswordComfirm = singleSelector('.js-modal-change-password-comfirm')
const  jsChangePassword = singleSelector('.js-change-password')

// function showUserChangePassword(){
//     jsAdminContentPageChangePassword.style.display = "block"
//     jsAdminTransactionHistoryContent.style.display = "none"
//     jsAdminContentPageChangePassword.style.display = "none"

//     jsAdminTransactionHeaderTitle.classList.remove('admin-header-name-active')
//     jsAdminContentPageChangePassword.style.animation = "OpacityIn ease .8s"
//     jsAdminPasswordHeaderTitle.classList.add('admin-header-name-active')
// }

// function showUserTransactionHistory(){
//     jsAdminTransactionHistoryContent.style.display = "block"
//     jsAdminContentPageChangePassword.style.display = "none"
//     jsAdminDetailUserUpdateDdCard.style.display = "none"
//     jsAdminTransactionHistoryContent.style.animation = "OpacityIn ease .8s"
//     jsAdminTransactionHeaderTitle.classList.add('admin-header-name-active')
//     jsAdminPasswordHeaderTitle.classList.remove('admin-header-name-active')
// }

// function showUserUpdateIdCard(){
//     jsAdminDetailUserUpdateDdCard.style.display = "block"
//     jsAdminContentPageChangePassword.style.display = "none"
//     jsAdminTransactionHistoryContent.style.display = "none"
//     jsAdminTransactionHistoryContent.style.animation = "OpacityIn ease .8s"
//     jsAdminUpdateIdCardHeaderTitle.classList.add('admin-header-name-active')
//     jsAdminPasswordHeaderTitle.classList.remove('admin-header-name-active')
// }

// if(jsAdminPasswordHeaderTitle && jsAdminTransactionHeaderTitle || jsAdminPasswordHeaderTitle && jsAdminTransactionHeaderTitle &&jsAdminUpdateIdCardHeaderTitle){
//     jsAdminPasswordHeaderTitle.addEventListener('click', showUserChangePassword)
//     jsAdminTransactionHeaderTitle.addEventListener('click', showUserTransactionHistory)
//     jsAdminUpdateIdCardHeaderTitle.addEventListener('click', showUserUpdateIdCard)
// }

const adminHeaderNameTab = multipleSelector('.admin-header-name-tab')
const adminHeaderNameTabPane = multipleSelector('.admin-header-name-tab-pane')

const adminHeaderNameTabActive = singleSelector('.admin-header-name-tab.admin-header-name-tab-active')
const adminHeaderLine = singleSelector('.admin-header-name-tab-active')



if(adminHeaderNameTab){
    adminHeaderNameTab.forEach((tab, index) => {
        const panes = adminHeaderNameTabPane[index]
        tab.onclick = function (){
    
            singleSelector('.admin-header-name-tab.admin-header-name-tab-active').classList.remove('admin-header-name-tab-active')
    
            singleSelector('.admin-header-name-tab-pane.active').classList.remove('active')

            tab.classList.add('admin-header-name-tab-active')
            panes.classList.add('active')
            panes.style.animation = "fadeIn ease .8s"
        }
        
    })
}

if(jsChangePassword){
    jsChangePassword.addEventListener('click', () => {
        jsModalChangePasswordComfirm.style.display = "flex"
        modalHeaderTitle.innerHTML = `Change Password`
        modalHeaderCntent.innerHTML = `Do you want to change password account?`
    })

    jsModalDetailUserClose.addEventListener('click', () => {
        jsModalChangePasswordComfirm.style.display = "none"
    })
    jsModalDetailUserIconClose.addEventListener('click', () => {
        jsModalChangePasswordComfirm.style.display = "none"
    })
}


const fileImageView = singleSelector('#uploadImage-view')
const fileImage = singleSelector('#uploadImage-edit')

if(fileImage){
    fileImage.addEventListener('change', (e) => {
        var fileName = fileImage.value.split('\\').pop()
        var file = e.target.files[0]
        var fileReader = new FileReader()
        if(fileName.length > 0 ){
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                var result = fileReader.result
                fileImageView.src = result
            }
        }
    })
    fileImage.value=""
}
