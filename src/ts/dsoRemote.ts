import {BaseEntity, Criteria, Dso} from "./ds";
import {ajax} from "./ajax";
import {hub} from "mvdom";

export class DsoRemote<E extends BaseEntity> implements Dso<E>{

    private _type: string;

    constructor(type: string) {
        this._type = type;
    }

    create(entity: E): Promise<E> {
        var type = this._type;
        return new Promise(function(resolve, reject){
            // get the new entity from the server (will have the .id)
            ajax.post("/api/"+type.toLocaleLowerCase()+"/create", {entity: JSON.stringify(entity)}).then(function(result){
                // we resolve first, to allow the caller to do something before the event happen
                resolve(result);
                // we publish the dataservice event
                hub("dataHub").pub(type, "create", entity);
            });

        });
    }

    update(id: number, entity: E): Promise<E> {
        var type = this._type;
        return new Promise(function(resolve, reject){
            ajax.post("/api/"+type.toLocaleLowerCase()+"/update", {entity: JSON.stringify(entity), id: id * 1}).then(function(result){
                // we resolve first, to allow the caller to do something before the event happen
                resolve(result);
                // we publish the dataservice event
                hub("dataHub").pub(type, "update", entity);
            });
        });
    }

    get(id: number): Promise<E> {
        var type = this._type;
        return new Promise(function(resolve, reject){
            ajax.get("/api/"+type.toLocaleLowerCase()+"/get", {id: id * 1}).then(function(result){
                resolve(result);
            });
        });
    }

    list(criteria: Criteria): Promise<E[]> {
        var type = this._type;
        // TODO: need to add the filtering support
        return new Promise(function(resolve, reject){
            criteria = criteria || {};
            ajax.get("/api/"+type.toLocaleLowerCase()+"/list", {criteria: JSON.stringify(criteria)}).then(function(result){
                resolve(result);
            });
        });
    }

    first(criteria: Criteria): Promise<E | null> {
        var type = this._type;
        return new Promise(function(resolve, reject){
            criteria = criteria || {};
            ajax.get("/api/"+type.toLocaleLowerCase()+"/first", {criteria: JSON.stringify(criteria)}).then(function(result){
                resolve(result);
            });
        });
    }

    remove(id: number): Promise<boolean> {
        var type = this._type;
        return new Promise(function(resolve, reject){
            ajax.post("/api/"+type.toLocaleLowerCase()+"/delete", {id: id * 1}).then(function(result){
                // we resolve first, to allow the caller to do something before the event happen
                resolve(result);
                // we publish the dataservice event
                hub("dataHub").pub(type, "delete", id);
            });
        })
    }

}
