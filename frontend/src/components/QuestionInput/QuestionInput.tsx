import { useEffect, useState } from 'react'
import { Stack, TextField } from '@fluentui/react'
import { SendRegular } from '@fluentui/react-icons'
import { GlobalWorkerOptions, getDocument, version } from 'pdfjs-dist';
import Send from '../../assets/Send.svg'
import Upload from '../../assets/Attachment.svg'
import styles from './QuestionInput.module.css'
import ThumbnailGallery from '../ThumbnailGallery/ThumbnailGallery'

interface Props {
  onSend: (question: string, id?: string) => void
  disabled: boolean
  placeholder?: string
  clearOnSend?: boolean
  conversationId?: string
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, conversationId }: Props) => {
  const [question, setQuestion] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File>()
  const [base64, setBase64] = useState<string | ArrayBuffer | null>()
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
      if (!selectedFile) {
          return
      }

      const objectUrl = URL.createObjectURL(selectedFile)

      if (selectedFile.type === 'application/pdf') {
        renderPdfToImages(selectedFile)
      } else {
        var reader = new FileReader();
        reader.readAsDataURL(selectedFile); 
        reader.onloadend = function() {
          setBase64(reader.result)
        }
      }
      
      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  useEffect(() => {
    if (base64) {
      //TODO :: sometiems the image does not get added and the thumbnail gallery is not shown (maybe related to the clean history chat)
      addImage(base64.toString());
      setBase64(null);
    }
  }, [base64]);

  const renderPdfToImages = async (file: File) => {
    // Set the workerSrc to the relative URL of the worker script
    GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async function () {
      const pdfData = new Uint8Array(reader.result as ArrayBuffer);
      
      const pdf = await getDocument({ data: pdfData }).promise;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 3 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        const imageData = canvas.toDataURL('image/png');
        addImage(imageData);
      }
    };
  };

  const addImage = (image: string) => {
    setThumbnails([...thumbnails, image]);
  };

  const removeImage = (index: number) => {
    setThumbnails(thumbnails.filter((_, i) => i !== index));
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
  }

  const sendQuestion = () => {
    if (disabled || (!question.trim() && thumbnails.length === 0)) {
      return
    }

    // Construct the content array
    const content = [
      {
        type: "text",
        text: question
      },
      ...thumbnails.flatMap((thumbnail, index) => [
        {
          type: "image_url",
          image_url: {
            url: thumbnail
          }
        }
      ])
    ];

    // TODO :: if there are no images uploaded submit a simple question (just text)

    // Stringify the content array
    const questionJson = JSON.stringify({ content });

    if (conversationId) {
      onSend(questionJson, conversationId)
    } else {
      onSend(questionJson)
    }

    if (clearOnSend) {
      setQuestion('')
    }

    // Reset thumbnails and base64
    setThumbnails([]);
    setBase64(null);
  }

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === 'Enter' && !ev.shiftKey && !(ev.nativeEvent?.isComposing === true)) {
      ev.preventDefault()
      sendQuestion()
    }
  }

  const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setQuestion(newValue || '')
  }

  const sendQuestionDisabled = disabled || (!question.trim() && thumbnails.length === 0)
  return (
       
      <Stack className={styles.questionInputContainer}>
        <div className={styles.uploadedImagesContainer}>
          <ThumbnailGallery thumbnails={thumbnails} removeImage={removeImage} />
        </div>
        
        <TextField
          className={styles.questionInputTextArea}
          placeholder={placeholder}
          multiline
          resizable={false}
          borderless
          value={question}
          onChange={onQuestionChange}
          onKeyDown={onEnterPress}
        />

        <div className={styles.buttonsContainer}>
          <div
            className={styles.questionInputUploadButtonContainer}
            role="button"
            tabIndex={0}
            aria-label="Upload a file button">
            <label htmlFor="file-input">
              <img src={Upload} className={styles.questionInputUploadButton} alt="Upload Button" />
            </label>
            <input
              id="file-input"
              className={styles.questionInputFile}
              type="file"
              accept="image/*,application/pdf"
              onChange={onSelectFile}
            />
          </div>
          <div
            className={styles.questionInputSendButtonContainer}
            role="button"
            tabIndex={0}
            aria-label="Ask question button"
            onClick={sendQuestion}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? sendQuestion() : null)}>
            {sendQuestionDisabled ? (
              <SendRegular className={styles.questionInputSendButtonDisabled} />
            ) : (
              <img src={Send} className={styles.questionInputSendButton} alt="Send Button" />
            )}
          </div>
        </div>
        
        <div className={styles.questionInputBottomBorder} />
      </Stack>
  )
}
