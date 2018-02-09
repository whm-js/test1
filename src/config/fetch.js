// import {
// 	baseUrl
// } from './env'

var baseUrl = 'http://101.37.24.216:3009/' //服务器地址
if (location.hostname == 'newtest.ksbao.com' || location.hostname == 'localhost') {
    baseUrl = 'http://101.37.24.216:3003/'
}

export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {
    type = type.toUpperCase();
    url = baseUrl + url;

    if (type == 'GET') {
        let dataStr = ''; //数据拼接字符串
        Object.keys(data).forEach(key => {
            dataStr += key + '=' + data[key] + '&';
        })

        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr;
        }
    }

    if (window.fetch && method == 'fetch') {
        let requestConfig = {
            // credentials: 'include',
            method: type,
            headers: {
                Accept: 'application/json',
                // 'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/x-www-form-urlencoded'
			},
            mode: "cors",
            cache: "default"
        }

        if (type == 'POST') {
            let dataStr = ''; //数据拼接字符串
            Object.keys(data).forEach(key => {
                dataStr += key + '=' + data[key] + '&';
            })

            if (dataStr !== '') {
                dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
                // url = url + '?' + dataStr;
            }
            Object.defineProperty(requestConfig, 'body', {
                value: dataStr
            })
        }

        try {
            const response =await fetch(url, requestConfig)
            // .then(res => {
            //     return res.json();
            // });
            const responseJson = await response.json();
            return responseJson
        } catch (error) {
            throw new Error(error)
        }
    } else {
        return new Promise((resolve, reject) => {
            let requestObj;
            if (window.XMLHttpRequest) {
                requestObj = new XMLHttpRequest();
            } else {
                requestObj = new ActiveXObject;
            }

            let sendData = '';
            if (type == 'POST') {
                sendData = JSON.stringify(data);
            }

            requestObj.open(type, url, true);
            requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            requestObj.send(sendData);

            requestObj.onreadystatechange = () => {
                if (requestObj.readyState == 4) {
                    if (requestObj.status == 200) {
                        let obj = requestObj.response
                        if (typeof obj !== 'object') {
                            obj = JSON.parse(obj);
                        }
                        resolve(obj)
                    } else {
                        reject(requestObj)
                    }
                }
            }
        })
    }
}