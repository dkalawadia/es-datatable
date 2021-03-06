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

    createQuery(prop){
        var query ={match_all: {}};
        if(prop.activeFilters.length>0){
            var filter = [];
            $.each(prop.activeFilters,function(index,item){
                filter.push({['term']:{[item.id]:item.value}});
            })
            query = {
                "bool":{
                    "must":filter
                }
            }
        }
        return query;
        

    }
    getPage(prop){
        var client = this.createESConnection();
        var query = this.createQuery(prop);
        return new Promise(function(resolve,reject){
            var from = prop.page === 1? 1: (prop.perPage * (prop.page-1))+1
            var sortProperties = Object.keys(prop.sortingColumns);
            
            client.search({
                index: 'bank',
                type: 'account',
                body: {
                    from: from,
                    size: prop.perPage,
                    sort: [{[sortProperties[0]]:prop.sortingColumns[sortProperties[0]].direction}],
                    query: query
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