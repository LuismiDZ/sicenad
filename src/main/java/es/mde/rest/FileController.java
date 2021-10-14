package es.mde.rest;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import es.mde.models.File;
import es.mde.models.Response;
import es.mde.servicios.FileServiceAPI;

@RestController
//@CrossOrigin("*")
@RequestMapping("/api/files")
public class FileController {

	@Autowired
	private FileServiceAPI fileServiceAPI;

	// ******************************
	// Métodos para subir los escudos
	// ******************************
	
//	@PostMapping("/subirEscudos")
//	public ResponseEntity<Response> uploadFileEscudos(@RequestParam("files") List<MultipartFile> files) throws Exception {
//		fileServiceAPI.save(files);
//		return ResponseEntity.status(HttpStatus.OK)
//				.body(new Response("Los archivos fueron cargados correctamente al servidor"));
//	}
	
	@PostMapping("/subirEscudo")
	public ResponseEntity<Response> uploadFileEscudo(@RequestParam("file") MultipartFile file) throws Exception {
		fileServiceAPI.saveEscudo(file);
		return ResponseEntity.status(HttpStatus.OK)
				.body(new Response("El archivo fue cargado correctamente al servidor"));
	}
	
	@GetMapping("/borrarEscudo/{filename:.+}")
	public ResponseEntity<Response> borrarFileEscudo(@PathVariable String filename) throws Exception {
		fileServiceAPI.borrarEscudo(filename);
		return ResponseEntity.status(HttpStatus.OK)
				.body(new Response("El archivo fue borrado correctamente del servidor"));
	}
	
	@GetMapping("/escudos/{filename:.+}")
	public ResponseEntity<Resource> getFileEscudo(@PathVariable String filename) throws Exception {
		Resource resource = fileServiceAPI.loadEscudo(filename);
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
				.body(resource);
	}
	
	@GetMapping("/escudos/all")
	public ResponseEntity<List<File>> getAllFilesEscudos() throws Exception {
		List<File> files = fileServiceAPI.loadAllEscudos().map(path -> {
			String filename = path.getFileName().toString();
			String url = MvcUriComponentsBuilder.fromMethodName(FileController.class, "getFileEscudo", path.getFileName().toString()).build().toString();
			
			return new File(filename, url);
		}).collect(Collectors.toList());
		
		return ResponseEntity.status(HttpStatus.OK).body(files);
	}

	// *********************************************************
	// Métodos para tratar los ficheros asociados a los recursos
	// *********************************************************
	
	@PostMapping("/subirDocRecursos/{id}")
	public ResponseEntity<Response> uploadFileDocRecursos(@RequestParam("files") List<MultipartFile> files, @PathVariable("id") String id) throws Exception {
		fileServiceAPI.saveDocRecursos(files, id);
		return ResponseEntity.status(HttpStatus.OK)
				.body(new Response("Los archivos fueron cargados correctamente al servidor"));
	}
	
	@PostMapping("/subirDocRecurso/{id}")
	public ResponseEntity<Response> uploadFileDocRecurso(@RequestParam("file") MultipartFile file, @PathVariable("id") String id) throws Exception {
		fileServiceAPI.saveDocRecurso(file, id);
		return ResponseEntity.status(HttpStatus.OK)
				.body(new Response("El archivo fue cargado correctamente al servidor"));
	}

	@GetMapping("/borrarDocRecurso/{id}/{filename:.+}")
	public ResponseEntity<Response> borrarFileDocRecurso(@PathVariable String filename, @PathVariable("id") String id) throws Exception {
		fileServiceAPI.borrarDocRecurso(filename, id);
		return ResponseEntity.status(HttpStatus.OK)
				.body(new Response("El archivo fue borrado correctamente del servidor"));
	}
	
	@GetMapping("/borrarCarpetaDocRecurso/{id}")
	public ResponseEntity<Response> borrarCarpetaDocRecurso(@PathVariable("id") String id) throws Exception {
		
		fileServiceAPI.borrarCarpetaDocRecurso(id);
		return ResponseEntity.status(HttpStatus.OK)
				.body(new Response("La carpeta del recurso fue borrada correctamente del servidor"));
	}
	
	@GetMapping("/docRecursos/{id}/{filename:.+}")
	public ResponseEntity<Resource> getFileDocRecurso(@PathVariable String filename, @PathVariable("id") String id) throws Exception {
		Resource resource = fileServiceAPI.loadDocRecurso(filename, id);
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
				.body(resource);
	}
	
	@GetMapping("/docRecursos/all")
	public ResponseEntity<Resource> getFileDocRecurso(@PathVariable String filename) throws Exception {
		Resource resource = fileServiceAPI.loadDocRecurso(filename);
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
				.body(resource);
	}
	
	@GetMapping("/docRecursos/{id}/all")
	public ResponseEntity<List<File>> getAllFilesDocRecursos(@PathVariable("id") String id) throws Exception {
		List<File> files = fileServiceAPI.loadAllDocRecursos(id).map(path -> {
			String filename = path.getFileName().toString();
			String url = MvcUriComponentsBuilder.fromMethodName(FileController.class, "getFileDocRecurso", path.getFileName().toString()).build().toString();
			
			return new File(filename, url);
		}).collect(Collectors.toList());
		
		return ResponseEntity.status(HttpStatus.OK).body(files);
	}
	
	// ************************************************************
	// Métodos para tratar los ficheros asociados a las solicitudes
	// ************************************************************

	@PostMapping("/subirDocSolicitudes/{id}")
	public ResponseEntity<Response> uploadFileDocSolicitudes(@RequestParam("files") List<MultipartFile> files, @PathVariable("id") String id) throws Exception {
		fileServiceAPI.saveDocSolicitudes(files, id);
		return ResponseEntity.status(HttpStatus.OK)
				.body(new Response("Los archivos fueron cargados correctamente al servidor"));
	}
	
	@PostMapping("/subirDocSolicitud/{id}")
	public ResponseEntity<Response> uploadFileDocSolicitud(@RequestParam("file") MultipartFile file, @PathVariable("id") String id) throws Exception {
		fileServiceAPI.saveDocSolicitud(file, id);
		return ResponseEntity.status(HttpStatus.OK)
				.body(new Response("El archivo fue cargado correctamente al servidor"));
	}

	@GetMapping("/borrarDocSolicitud/{id}/{filename:.+}")
	public ResponseEntity<Response> borrarFileDocSolicitud(@PathVariable String filename, @PathVariable("id") String id) throws Exception {
		fileServiceAPI.borrarDocSolicitud(filename, id);
		return ResponseEntity.status(HttpStatus.OK)
				.body(new Response("El archivo fue borrado correctamente del servidor"));
	}
	
	@GetMapping("/borrarCarpetaDocSolicitud/{id}")
	public ResponseEntity<Response> borrarCarpetaDocSolicitud(@PathVariable("id") String id) throws Exception {
		
		fileServiceAPI.borrarCarpetaDocSolicitud(id);
		return ResponseEntity.status(HttpStatus.OK)
				.body(new Response("La carpeta de la solicitud fue borrada correctamente del servidor"));
	}
	
	@GetMapping("/docSolicitudes/{id}/{filename:.+}")
	public ResponseEntity<Resource> getFileDocSolicitud(@PathVariable String filename, @PathVariable("id") String id) throws Exception {
		Resource resource = fileServiceAPI.loadDocSolicitud(filename, id);
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
				.body(resource);
	}
	
	@GetMapping("/docSolicitudes/all")
	public ResponseEntity<Resource> getFileDocSolicitud(@PathVariable String filename) throws Exception {
		Resource resource = fileServiceAPI.loadDocSolicitud(filename);
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
				.body(resource);
	}
	
	@GetMapping("/docSolicitudes/{id}/all")
	public ResponseEntity<List<File>> getAllFilesDocSolicitud(@PathVariable("id") String id) throws Exception {
		List<File> files = fileServiceAPI.loadAllDocSolicitudes(id).map(path -> {
			String filename = path.getFileName().toString();
			String url = MvcUriComponentsBuilder.fromMethodName(FileController.class, "getFileDocSolicitud", path.getFileName().toString()).build().toString();
			
			return new File(filename, url);
		}).collect(Collectors.toList());
		
		return ResponseEntity.status(HttpStatus.OK).body(files);
	}

}
