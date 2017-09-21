
import {daoRegistry} from "../dao/dao-registry";
import {BaseDao} from "../dao/BaseDao";

const baseURI = "/api";
export const routes: any[] = [];

// --------- Gerneric APIs --------- //
routes.push({
	method: 'GET',
	path: baseURI + "/{type}/list",
	handler: async function (request: any, reply: any) {
		var jsonString = request.url.query.criteria;
		var opts = null;
		if(jsonString && jsonString != "undefined"){
			opts = JSON.parse(jsonString);
		}
        var type : string = request.url.path.split("/")[2];
		var dao : BaseDao = daoRegistry.getDao(type);
		var list = await dao.list(opts);
		reply(list);
	}
});

routes.push({
	method: 'GET',
	path: baseURI + "/{type}/get",
	handler: async function(request: any, reply: any){
        var type : string = request.url.path.split("/")[2];
        var dao : BaseDao = daoRegistry.getDao(type);
		var entity = await dao.get(parseInt(request.url.query.id));
		reply(entity || {});
	}
});

routes.push({
    method: 'POST',
    path: baseURI + "/{type}/delete",
    handler: async function(request: any, reply: any){
        var type : string = request.url.path.split("/")[2];
        var dao : BaseDao = daoRegistry.getDao(type);
        var entity = await dao.delete(parseInt(request.payload.id));
        reply(entity || {});
    }
});

routes.push({
	method: 'POST',
	path: baseURI + "/{type}/create",
	handler: async function(request: any, reply: any){
        var type : string = request.url.path.split("/")[2];
        var dao : BaseDao = daoRegistry.getDao(type);
		var entity = JSON.parse(request.payload.entity);
		entity = Object.assign({}, entity);
		var entityId = await dao.create(entity);
		entity.id = entityId;
		reply(entity);
	}
});

routes.push({
    method: 'POST',
    path: baseURI + "/{type}/update",
    handler: async function(request: any, reply: any){
        var type : string = request.url.path.split("/")[2];
        var dao : BaseDao = daoRegistry.getDao(type);
        var entity = JSON.parse(request.payload.entity);
        var id = request.payload.id;
        entity = Object.assign({}, entity);
        var resEntity = await dao.update(id,entity);
        reply(resEntity);
    }
});