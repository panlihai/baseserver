/**
 * Created by panlihai on 2017-02-08.
 */
module.exports = {
    //获取关联条件值
    getSqlWhereByLinkApp:function(mainAppObj,mainAppId,linkApp){
        var s = linkApp.LINKFILTER.split(':{');
        var where  = "";
        s.forEach(function(str){
            if(str.indexOf('}')==-1){
                where += str.replace(linkApp.ITEMAPP+".",'');
            }else{
                var str2 = str.split("}");
                where += mainAppObj[str2[0].toUpperCase()];
                if(str2.length>1){
                    where +=str2[1];
                }   
            }
        });
        return where;
    }
};
