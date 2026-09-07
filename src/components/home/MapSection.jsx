import React from 'react';
import { SectionHeading, MapEmbed } from '../shared';

export const MapSection = () => {
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15833.090333276681!2d108.3184511!3d-7.2096756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f5f9eb28114c9%3A0x6e8e2eeb682126eb!2sPasiragung%2C%20Kec.%20Hantara%2C%20Kabupaten%20Kuningan%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1709210214282!5m2!1sid!2sid";

  return (
    <section id="map" className="py-20 px-4 bg-surface border-t border-border">
      <div className="container mx-auto">
        <SectionHeading 
          title="Lokasi Desa Pasiragung" 
          subtitle="Kunjungi kami dan rasakan keramahan warga desa secara langsung."
        />
        <MapEmbed embedUrl={mapEmbedUrl} title="Peta Desa Pasiragung" />
      </div>
    </section>
  );
};
