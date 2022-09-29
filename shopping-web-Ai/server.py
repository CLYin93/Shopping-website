
from sanic import Sanic
# from sanic.response import text 
from sanic.response import json
import tensorflow as tf
import config
# from prepare_data import load_and_preprocess_image
from models import inception_v3

def load_and_preprocess_image(img_path):
    # read pictures
    img_raw = tf.io.read_file(img_path)
    # decode pictures
    img_tensor = tf.image.decode_jpeg(img_raw, channels=config.channels)
    # resize
    img_tensor = tf.image.resize(img_tensor, [config.image_height, config.image_width])
    img_tensor = tf.cast(img_tensor, tf.float32)
    # normalization
    img = img_tensor / 255.0
    return img


def get_model():
    model = inception_v3.InceptionV3(num_class=config.NUM_CLASSES)

    model.build(input_shape=(None, config.image_height, config.image_width, config.channels))
    

    return model

def get_single_picture_prediction(model, picture_dir):
    image_tensor = load_and_preprocess_image(picture_dir)
    image = tf.expand_dims(image_tensor, axis=0)
    prediction = model(image, training=False)
    pred_class = tf.math.argmax(prediction, axis=-1)
    
    return pred_class

app = Sanic("shoppingAIdApp")



@app.route('/runAI', methods = ['POST']) 
async def runAI(request): 
    imgName = request.body
    imgName= str(imgName,'UTF-8')
    print(imgName)
    


    print(imgName ,len(imgName))
    imgPath = config.server_pictures_dir+imgName
    print(imgPath)
    pred_class = get_single_picture_prediction(model, imgPath)
    print(pred_class.numpy()[0])
    if pred_class.numpy()[0] == 1: return json("維他檸檬茶")
    if pred_class.numpy()[0] == 0: return json("竹蔗茅根海底椰")

    # Return data in json format 
   
 

if __name__ == "__main__":
    model = get_model()
    model.load_weights(filepath= config.save_model_dir)
    app.run(host='localhost', port=8081, debug=True)
    print('Server is running on port:8081')

    