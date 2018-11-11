# Everlife AI Artist

Our artist can style pictures for you using his [AI
Intelligence](https://medium.com/tensorflow/neural-style-transfer-creating-art-with-deep-learning-using-tf-keras-and-eager-execution-7d541ac31398)

![ai-artist.png](ai-artist.png)

## Setup
This skill requires you to set up the
[everlife-ai-artist](https://github.com/everlifeai/everlife-ai-artist)
service. Once this starts up you must put the following parameters in
your `cfg.env` (located in `elife.data`):

        AIARTIST_HOST=<<the ai artist IP (the machine ip)>>
        AIARTIST_PORT=<<the ai artist service port>>

This skill will then be available for you in your [default
gui](https://github.com/everlifeai/qwert). Remember you can start your
default gui using:

        $> ./run.sh gui

## Styles
The following styles are understood by the artist:

* muse
* rain
* scream
* udnie
* wave
* wreck


## Feedback
For feedback, enhancements, or bug reports, please [contact
us](https://everlife.ai).

