/**
 * Created by panlihai on 2017-01-20.
 */
module.exports = {
//获取时间戳
    getTimestamp: function () {
        return Date.parse(new Date()) / 1000;
    }
};
