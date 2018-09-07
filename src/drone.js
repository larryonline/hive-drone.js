/*jslint esversion:6 */
import c from 'validate.io';
import PathParser from 'path-parser';
import ParseUrl from 'parse-url';


/**
 * 工蜂负责处理爬虫下载的资源
 */
export default class Drone {

    constructor() {
        this.overlord = null;
        this.callbacks = {};
        this._host = null;
    }

    host() {
        let a = arguments;
        if (0 == a.length) {
            return this._host ? this._host.href : null;
        } else if (1 == a.length && c.isString()) {
            this._host = ParseUrl(a[0]);
        } else {
            throw new Error(`invalid arguments: ${arguments}`);
        }
    }

    /**
     * 抓取目标
     * crwal(url)
     * crawl(request)
     */
    crawl() {
        let a = arguments;
        if (1 == a.length && (c.isURI(a[0]) || c.isObject(a[0]))) {
            this.overlord.submit(a[0]);
        } else {
            throw new Error(`invalid arguments: ${arguments}`);
        }
    }

    /**
     * 处理抓取目标的反馈
     */
    catch (pattern, callback) {
        if (c.isString(pattern) && c.isFunction(callback)) {
            let list = this.callbacks[pattern] || [];
            list.push(callback);
            this.callbacks[pattern] = list;
        } else {
            throw new Error(`invalid arguments ${arguments}`);
        }
    }

    feed(url, payload) {
        // console.dir(`feed ${url}: ${payload}`);
        let parsedURL = ParseUrl(url);
        if (parsedURL &&
            (null == this._host || this._host.resource == parsedURL.resource)
        ) {
            for (let pattern in this.callbacks) {
                let parser = new PathParser(pattern);
                // console.log(`url: ${url} -> path: ${parsedURL.pathname}`)
                // console.log(
                //     `parser.test('${pattern}', '${url}') = ${parser.test(parsedURL.pathname)}`
                // );

                if (parser.test(parsedURL.pathname)) {
                    let callbacks = this.callbacks[pattern];
                    callbacks.forEach(elem => {
                        elem(url, payload);
                    });
                }
            }
        }
    }

    /**
     * 抛出生成的数据
     */
    dump(id, entry) {
        this.overlord.put(id, entry);
    }

    /**
     * 载入生成的数据
     */
    grab(id) {
        this.overlord.get(id, entry);
    }
}
