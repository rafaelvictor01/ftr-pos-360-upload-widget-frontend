import axios from "axios"
import type { IUploadFileRequestDTO } from "../dtos/IUploadFileRequestDTO"
import type { IUploadFileResponseDTO } from "../dtos/IUploadFileResponseDTO"

export async function uploadFileController(props: IUploadFileRequestDTO): Promise<IUploadFileResponseDTO> {
  const body = new FormData()
  body.append('file', props.file)

  const response = await axios.post('http://localhost:3333/upload', body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return { url: response?.data?.url }
}
