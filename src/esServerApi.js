'use strict';
import elasticsearch from 'elasticsearch';
import $ from 'jquery';


class esServerApi{

    constructor(){

    }
    createESConnection () {
        var client = new elasticsearch.Client({
            host: 'http://localhost:9200',
            log: 'trace'
        });
        return client;
    }

    getPage(prop){
        var client = this.createESConnection();
        return new Promise(function(resolve,reject){
            var from = prop.page === 1? 1: (prop.perPage * (prop.page-1))+1
            client.search({
                index: 'bank',
                type: 'account',
                body: {
                from: from,
                size: prop.perPage,
                sort: [{[prop.sortingColumns.property]:prop.sortingColumns.direction}],
                query: {
                    match_all: {}
                }
                }
            }).then(resp => {
                var hits = resp.hits.hits;
                var rows = [];       
                $.each(hits,function(index, hit){
                rows.push(hit._source);
                });
                resolve({"rows":rows, "total":resp.hits.total})
            },function (err) {
                console.trace(err.message);
                reject(err);
            });
        });    
    }
};

export default esServerApi;