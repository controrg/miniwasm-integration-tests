FROM ghcr.io/initia-labs/miniwasm:v0.2.15
USER root
COPY ./start-minitiad.sh /start-minitiad.sh
RUN chmod +x /start-minitiad.sh
RUN chown minitia:minitia /start-minitiad.sh
USER minitia
ENTRYPOINT ["/start-minitiad.sh"]
