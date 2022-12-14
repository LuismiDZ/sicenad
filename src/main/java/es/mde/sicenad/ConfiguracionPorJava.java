package es.mde.sicenad;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * ConfiguracionPorJava va a establecer los parametros configurables en los distintos properties, referenciándolos.
 * @author JOSE LUIS PUENTES ALAMOS - MIGUEL PRADA MUNOZ
 *
 */
@Configuration
@PropertySource({ "classpath:config/rest.properties", "classpath:config/jackson.properties", "classpath:config/archivos.properties",
"classpath:config/mail.properties" })
@ComponentScan({"es.mde"})
public class ConfiguracionPorJava {
	@Value("${ruta.escudos}")
	private String rutaEscudos;

	@Value("${ruta.docRecursos}")
	private String rutaDocRecursos;

	@Value("${ruta.docSolicitudes}")
	private String rutaDocSolicitudes;
	
	@Value("${ruta.cartografias}")
	private String rutaCartografias;
	
	@Value("${ruta.normativas}")
	private String rutaNormativas;
	
	@Value("${ruta.infoCenads}")
	private String rutaInfoCenads;
	
	@Value("${size.escudos}")
	private long sizeLimiteEscudo;
	
	@Value("${size.docRecursos}")
	private long sizeLimiteDocRecurso;
	
	@Value("${size.docSolicitudes}")
	private long sizeLimiteDocSolicitud;

	/**
	 * Devuelve la ruta donde se guardarán los escudos
	 * @return Devuelve la ruta donde se guardarán los escudos
	 */
	@Bean("rutaEscudos")
	public String getRutaEscudos() {

		return rutaEscudos;
	}

	/**
	 * Devuelve la ruta donde se guardarán los documentos de los recursos
	 * @return Devuelve la ruta donde se guardarán los documentos de los recursos
	 */
	@Bean("rutaDocRecursos")
	public String getRutaDocRecursos() {

		return rutaDocRecursos;
	}

	/**
	 * Devuelve la ruta donde se guardarán los documentos de las solicitudes
	 * @return Devuelve la ruta donde se guardarán los documentos de las solicitudes
	 */
	@Bean("rutaDocSolicitudes")
	public String getRutaDocSolicitudes() {

		return rutaDocSolicitudes;
	}
	
	/**
	 * Devuelve la ruta donde se guardarán los documentos de las cartografias
	 * @return Devuelve la ruta donde se guardarán los documentos de las cartografias
	 */
	@Bean("rutaCartografias")
	public String getRutaCartografias() {

		return rutaCartografias;
	}
	
	/**
	 * Devuelve la ruta donde se guardarán los documentos de las normativas
	 * @return Devuelve la ruta donde se guardarán los documentos de las normativas
	 */
	@Bean("rutaNormativas")
	public String getRutaNormativas() {

		return rutaNormativas;
	}
	
	/**
	 * Devuelve la ruta donde se guardará la imagen del mapa de ayuda a llegar al CENAD
	 * @return Devuelve la ruta donde se guardará la imagen del mapa de ayuda a llegar al CENAD
	 */
	@Bean("rutaInfoCenads")
	public String getRutaInfoCenads() {

		return rutaInfoCenads;
	}

	/**
	 * Devuelve el tamaño máximo permitido para un escudo
	 * @return Devuelve el tamaño máximo permitido para un escudo
	 */
	@Bean("sizeLimiteEscudo")
	public long getSizeLimiteEscudo() {

		return sizeLimiteEscudo;
	}
	
	/**
	 * Devuelve el tamaño máximo permitido para un documento de un recurso
	 * @return Devuelve el tamaño máximo permitido para un documento de un recurso
	 */
	@Bean("sizeLimiteDocRecurso")
	public long getSizeLimiteDocRecurso() {

		return sizeLimiteDocRecurso;
	}
	
	/**
	 * Devuelve el tamaño máximo permitido para un documento de una solicitud
	 * @return Devuelve el tamaño máximo permitido para un documento de una solicitud
	 */
	@Bean("sizeLimiteDocSolicitud")
	public long getSizeLimiteDocSolicitud() {

		return sizeLimiteDocSolicitud;
	}
	
	/**
	 * Devuelve un ObjectMapper
	 * @return Devuelve un ObjectMapper
	 */
	@Bean
	public ObjectMapper getObjectMapper() {

		ObjectMapper mapper = new ObjectMapper();
		return mapper;
	}
	
	@Bean
	public JavaMailSender getJavaMailSender(@Value("${spring.mail.password}") String password,
			@Value("${spring.mail.username}") String direccion, @Value("${spring.mail.host}") String host,
			@Value("${spring.mail.port}") int port) {
		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setHost(host);
		mailSender.setPort(port);
		mailSender.setUsername(direccion);
		mailSender.setPassword(password);

		Properties props = mailSender.getJavaMailProperties();
		props.put("mail.transport.protocol", "smtp");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.debug", "true");

		return mailSender;
	}
}