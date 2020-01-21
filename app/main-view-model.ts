import { Observable } from "tns-core-modules/data/observable";
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { SSE } from 'nativescript-sse';


export class HelloWorldModel extends Observable {

    private _list: ObservableArray<any>;
    private _sse: any;

    private _counter: number;
    private _message: string;

    constructor() {
        super();

        this._list = new ObservableArray();
        this._sse = new SSE('https://api.particle.io/v1/events/blob', {'Authentication': 'Bearer '});
        this._sse.events.on('onConnect', data => {
            console.log(data.object.connected);
        });

        this._sse.events.on('onMessage', data => {
            this._list.push(JSON.parse(data.object.message.data));
            console.dir(JSON.parse(data.object.message.data));
        });
        this._sse.events.on('onError', data => {
            console.log(data.object.error);
        });

        // Initialize default values.
        this._counter = 42;
        this.updateMessage();
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        if (this._message !== value) {
            this._message = value;
            this.notifyPropertyChange("message", value);
        }
    }

    onTap() {
        this._counter--;
        this.updateMessage();
    }

    private updateMessage() {
        if (this._counter <= 0) {
            this.message = "Hoorraaay! You unlocked the NativeScript clicker achievement!";
        } else {
            this.message = `${this._counter} taps left`;
        }
    }
}
