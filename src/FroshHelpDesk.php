<?php declare(strict_types=1);

namespace FroshHelpDesk;

use Shopware\Core\Framework\Plugin;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;
use Symfony\Component\Config\FileLocator;

class FroshHelpDesk extends Plugin {

    public function build(ContainerBuilder $container): void
    {
        parent::build($container);
        $loader = new XmlFileLoader($container, new FileLocator(__DIR__ . '/DependencyInjection/'));
        $loader->load('services.xml');
    }

    /**
     * {@inheritdoc}
     */
    public function getAdministrationEntryPath(): string
    {
        return 'Resources/views/administration';
    }
}
