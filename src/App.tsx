import * as React from 'react';
import './App.css';

//components imports
import ImageComponent from "./Components/imageComponent";
import Loader from "./Components/Loader";

interface IAppProps {

}

interface IAppState {
    images: IImage[],
    showLoader: boolean
    loaderPercent: string
}

interface IImage {
    src: string,
    class: string,
    clickFunction?: any
}

class App extends React.Component<IAppProps,IAppState> {
    input:any;
    db:any;

    constructor(props: IAppProps){
        super(props);

        this.state = {
            images: [{src: process.env.PUBLIC_URL + '/images/plus.jpg',class:'image clickable',clickFunction:this.uploadImage}],
            showLoader: false,
            loaderPercent: ""
        };
    }

    setUpInput = () => {
        this.input = document.querySelector("input[type=file]");

        this.input.addEventListener('change', () => {
            const file = this.input.files[0];
            this.generateImage(file);
        });
    };

    setUpIndexDB = () => {
        const request = indexedDB.open("imagesDB", 1);

        request.onerror = function(err){
            console.error(err);
        };

        request.onsuccess = (e: any) => {
            console.log("DB opened successfully");

            this.db = e.target.result;

            const objectStore = this.db.transaction("imagesDB").objectStore("imagesDB");

            let storeImages: IImage[] = this.state.images;

            objectStore.openCursor().onsuccess = (event: any) => {
                let cursor = event.target.result;
                if (cursor) {
                    //console.log("KEY " + cursor.key + " VALUE " + cursor.value.src);
                    storeImages.push(cursor.value);
                    this.setState({
                        images: storeImages,
                        showLoader: true
                    });
                    cursor.continue();
                }
                else {
                    console.log("Done Reading!");

                    this.setState({
                        showLoader: false
                    });
                }
            };
        };

        request.addEventListener("upgradeneeded", function(e:any){
            console.log("upgradeneeded", e);

            const db = e.target.result;

            db.createObjectStore("imagesDB", {keyPath: "id", autoIncrement: true});
        });
    };

    componentDidMount() {
        this.setUpInput();
        this.setUpIndexDB();
    }

    uploadImage = () => {
        this.input.click();
    };

    generateImage = (file: Blob) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
            //console.log(reader.result);

            const tran = this.db.transaction(["imagesDB"], "readwrite");

            const images = tran.objectStore("imagesDB");

            const newImage : IImage = {
                src: reader.result,
                class:'image'
            };

            const request = images.add(newImage);

            request.onsuccess = (e: any) => {
                console.log("add success", e);
                this.state.images.push(newImage);
                this.setState({
                    ...images,
                    showLoader: false
                });
            };

            request.onerror = function(e: any){
                console.log("add error", e);
            }
        };

        reader.onprogress = (e)=>{
            this.setState({
                images: this.state.images,
                showLoader: true,
                loaderPercent: e.loaded/e.total*100+'%'
            });
            //console.log('Loading: '+ e.loaded/e.total*100+'%');
        };
    };

    generateImages = () => {
        return this.state.images.map((img, idx) => {
            return <ImageComponent key={idx} src={img.src} className={img.class} callbackFunc={img.clickFunction}/>
        });
    };

    public render() {
        return (
            <div id='images'>
                <input type="file"/>
                {this.generateImages()}
                <Loader show={this.state.showLoader} percent={this.state.loaderPercent}/>
            </div>
        );
    }
}

export default App;
