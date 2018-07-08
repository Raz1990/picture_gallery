import * as React from 'react';

interface IImagePROPS {
    src: string,
    className?: string,
    callbackFunc?: any
}

class ImageComponent extends React.Component<IImagePROPS,{}> {

    constructor(props: IImagePROPS){
        super(props);

    }

    public render() {
        return (
            <img src={this.props.src} onClick={this.props.callbackFunc} className={this.props.className}/>
        );
    }
}

export default ImageComponent;