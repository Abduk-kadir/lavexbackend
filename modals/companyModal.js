const mongoose=require('mongoose');
const valid=require('validator')

const companySchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'name of company is required']
    },
    bulstat:{
        type:String,
        required:[true,'name of company is required']
    },
    registrationAddress:{
        type:String,
        required:[true,'name of company is required']
    },
    city:{
        type:String,
        required:[true,'city of company is required']
    },
    accountPerson:{
        type:String,
        required:[true,'accountabel person is required']
    },
    translationName:{
        type:String,
        default:"default"
    },
    gstNumber:{
        type:String,
        validate:{
            validator:function(v){
               if(v.length==15){
               
                 return !valid.isNumeric(v)
               }
               else{
                return false
               }
            },
            message:props=>'it should be 15 digit'
        },
       


    },
    panNumber:{
        type:String,
        validate:{
            validator: function(v){
                if(v.length==10){
                  return ! valid.isNumeric(v)
                }
                else{
                    return false
                }

            },
            message:props=>`${props.value}is not correct shoud be alphanumeric and 10 digit `
        },

    },
    email:{
        type:String,
        validate: {
            validator: function(v) {
             return valid.isEmail(v)
            },
            message: props => `${props.value}  please provide a valid email!`
          },

      

    },
    mobile:{
        type:String,
        validate: {
            validator: function(v) {
             return valid.isMobilePhone(v,['am-Am', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-EH', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-PS', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'az-AZ', 'az-LB', 'az-LY', 'be-BY', 'bg-BG', 'bn-BD', 'bs-BA', 'ca-AD', 'cs-CZ', 'da-DK', 'de-AT', 'de-CH', 'de-DE', 'de-LU', 'dv-MV', 'dz-BT', 'el-CY', 'el-GR', 'en-AG', 'en-AI', 'en-AU', 'en-BM', 'en-BS', 'en-BW', 'en-CA', 'en-GB', 'en-GG', 'en-GH', 'en-GY', 'en-HK', 'en-IE', 'en-IN', 'en-JM', 'en-KE', 'en-KI', 'en-KN', 'en-LS', 'en-MO', 'en-MT', 'en-MU', 'en-MW', 'en-NG', 'en-NZ', 'en-PG', 'en-PH', 'en-PK', 'en-RW', 'en-SG', 'en-SL', 'en-SS', 'en-TZ', 'en-UG', 'en-US', 'en-ZA', 'en-ZM', 'en-ZW', 'es-AR', 'es-BO', 'es-CL', 'es-CO', 'es-CR', 'es-CU', 'es-DO', 'es-EC', 'es-ES', 'es-HN', 'es-MX', 'es-NI', 'es-PA', 'es-PE', 'es-PY', 'es-SV', 'es-UY', 'es-VE', 'et-EE', 'fa-AF', 'fa-IR', 'fi-FI', 'fj-FJ', 'fo-FO', 'fr-BE', 'fr-BF', 'fr-BJ', 'fr-CD', 'fr-CF', 'fr-FR', 'fr-GF', 'fr-GP', 'fr-MQ', 'fr-PF', 'fr-RE', 'fr-WF', 'ga-IE', 'he-IL', 'hu-HU', 'id-ID', 'ir-IR', 'it-IT', 'it-SM', 'ja-JP', 'ka-GE', 'kk-KZ', 'kl-GL', 'ko-KR', 'ky-KG', 'lt-LT', 'mg-MG', 'mn-MN', 'ms-MY', 'my-MM', 'mz-MZ', 'nb-NO', 'ne-NP', 'nl-AW', 'nl-BE', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-AO', 'pt-BR', 'pt-PT', 'ro-Md', 'ro-RO', 'ru-RU', 'si-LK', 'sk-SK', 'sl-SI', 'so-SO', 'sq-AL', 'sr-RS', 'sv-SE', 'tg-TJ', 'th-TH', 'tk-TM', 'tr-TR', 'uk-UA', 'uz-UZ', 'vi-VN', 'zh-CN', 'zh-HK', 'zh-MO', 'zh-TW'],{strictMode:true})
            },
            message: props => `${props.value} should be contain country code and only digit`
          },
       

    },
    website:{
        type:String,


    },
    state:{
        type:String,

    },
    stateCode:{
        type:String,
        enum:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,97,99]
        
    },
    bankDetail:{
        type:String,


    },
    chooseLogoFile:{
        type:String

    }
})
module.exports=mongoose.model("Company",companySchema)