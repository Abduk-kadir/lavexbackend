const mongoose=require('mongoose');
var valid = require('validator');
const registrationSchema=mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:[true,'name is required'],
      },
    email:{
        type:String,
        validate: {
            validator: function(v) {
             return valid.isEmail(v)
            },
            message: props => `${props.value}  please provide a valid email!`
          },
      required:[true]
       
    },
    password:{
        type:String,
        validate: {
            validator: function(v) {
             console.log('password is',v)   
             return valid.isStrongPassword(v)
            },
            message: props => `${props.value} contains minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 `
          },
      
        required:[true,'password is required'],
    },
    mobile:{
        type:String,
        validate: {
            validator: function(v) {
             return valid.isMobilePhone(v,['am-Am', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-EH', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-PS', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'az-AZ', 'az-LB', 'az-LY', 'be-BY', 'bg-BG', 'bn-BD', 'bs-BA', 'ca-AD', 'cs-CZ', 'da-DK', 'de-AT', 'de-CH', 'de-DE', 'de-LU', 'dv-MV', 'dz-BT', 'el-CY', 'el-GR', 'en-AG', 'en-AI', 'en-AU', 'en-BM', 'en-BS', 'en-BW', 'en-CA', 'en-GB', 'en-GG', 'en-GH', 'en-GY', 'en-HK', 'en-IE', 'en-IN', 'en-JM', 'en-KE', 'en-KI', 'en-KN', 'en-LS', 'en-MO', 'en-MT', 'en-MU', 'en-MW', 'en-NG', 'en-NZ', 'en-PG', 'en-PH', 'en-PK', 'en-RW', 'en-SG', 'en-SL', 'en-SS', 'en-TZ', 'en-UG', 'en-US', 'en-ZA', 'en-ZM', 'en-ZW', 'es-AR', 'es-BO', 'es-CL', 'es-CO', 'es-CR', 'es-CU', 'es-DO', 'es-EC', 'es-ES', 'es-HN', 'es-MX', 'es-NI', 'es-PA', 'es-PE', 'es-PY', 'es-SV', 'es-UY', 'es-VE', 'et-EE', 'fa-AF', 'fa-IR', 'fi-FI', 'fj-FJ', 'fo-FO', 'fr-BE', 'fr-BF', 'fr-BJ', 'fr-CD', 'fr-CF', 'fr-FR', 'fr-GF', 'fr-GP', 'fr-MQ', 'fr-PF', 'fr-RE', 'fr-WF', 'ga-IE', 'he-IL', 'hu-HU', 'id-ID', 'ir-IR', 'it-IT', 'it-SM', 'ja-JP', 'ka-GE', 'kk-KZ', 'kl-GL', 'ko-KR', 'ky-KG', 'lt-LT', 'mg-MG', 'mn-MN', 'ms-MY', 'my-MM', 'mz-MZ', 'nb-NO', 'ne-NP', 'nl-AW', 'nl-BE', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-AO', 'pt-BR', 'pt-PT', 'ro-Md', 'ro-RO', 'ru-RU', 'si-LK', 'sk-SK', 'sl-SI', 'so-SO', 'sq-AL', 'sr-RS', 'sv-SE', 'tg-TJ', 'th-TH', 'tk-TM', 'tr-TR', 'uk-UA', 'uz-UZ', 'vi-VN', 'zh-CN', 'zh-HK', 'zh-MO', 'zh-TW'],{strictMode:true})
            },
            message: props => `${props.value} should be contain country code and only digit`
          },
        required:[true]  
    },
    permission:{
      type:[
        
          {
              companyname: {
                  type: String,
                
                 
              },
             
              pages: {
                 type:[
                    {
                        pagename:{
                            type:String,
                          
                        },
                        access:{
                            type:[String],

                        }
                    }
                 ],
               
                
              },
          },
      ],
      default:[
      {
        companyname:"",
        pages:[
            {
                pagename:"",
                access:['','']
            },
            {
                pagename:"",
                access:['','']
            }
        ]
      }


      ]
     
    },



    isAdmin:{
      type:Boolean,
      default:false
    },
    token:{
        type:String,
        default:""
    }
   
})
module.exports=mongoose.model('Registration',registrationSchema)