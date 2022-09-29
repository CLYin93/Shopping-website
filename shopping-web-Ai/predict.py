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

def get_single_picture_prediction(model, localhost_pictures_dir):
    image_tensor = load_and_preprocess_image(localhost_pictures_dir)
    image = tf.expand_dims(image_tensor, axis=0)
    prediction = model(image, training=False)
    pred_class = tf.math.argmax(prediction, axis=-1)
    
    return pred_class


if __name__ == '__main__':
    # # GPU settings
    # gpus = tf.config.list_physical_devices('GPU')
    # if gpus:
    #     for gpu in gpus:
    #         tf.config.experimental.set_memory_growth(gpu, True)

    # load the model
    model = get_model()
    model.load_weights(filepath= config.save_model_dir)

    pred_class = get_single_picture_prediction(model, config.localhost_pictures_dir+'1.jpg')
    print(pred_class.numpy()[0],'healthworks')

    pred_class = get_single_picture_prediction(model, config.localhost_pictures_dir+'0.jpg')
    print(pred_class.numpy()[0],'vita')